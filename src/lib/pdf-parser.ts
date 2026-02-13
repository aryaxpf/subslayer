
import { Transaction } from "./types";
// Import pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist';

// IMPORTANT: We need to set the worker source.
// We are using a local worker file copied to the public directory.
// This avoids dynamic import issues with CDNs and bundlers.
if (typeof window !== 'undefined' && 'Worker' in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface TextItem {
    str: string;
    transform: number[]; // [scaleX, skewY, skewX, scaleY, x, y]
    width: number;
    height: number;
    dir: string;
}

export async function parsePDF(file: File): Promise<Transaction[]> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const transactions: Transaction[] = [];

    console.log(`[PDF Parser] Started parsing ${file.name} with ${pdf.numPages} pages.`);

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Improved Row Grouping (Binning by Y with tolerance)
        // PDF Y-coordinates can float (e.g., 100.1, 100.2). Rounding isn't enough.
        // We'll group items that are within a small Y-tolerance (e.g., 2-3 units).
        const rows: { y: number, items: TextItem[] }[] = [];
        const TOLERANCE = 4; // Vertical tolerance in PDF units

        textContent.items.forEach((item: any) => {
            const y = item.transform[5];

            // Try to find an existing row within tolerance
            const existingRow = rows.find(r => Math.abs(r.y - y) < TOLERANCE);

            if (existingRow) {
                existingRow.items.push(item);
            } else {
                rows.push({ y, items: [item] });
            }
        });

        console.log(`[PDF Parser] Page ${i}: Found ${rows.length} text rows.`);

        // Sort rows top-to-bottom (High Y to Low Y)
        rows.sort((a, b) => b.y - a.y);

        for (const row of rows) {
            // Sort items left-to-right
            row.items.sort((a, b) => a.transform[4] - b.transform[4]);

            // Join text with spaces
            const fullRowText = row.items.map(item => item.str).join(" ").trim();
            if (!fullRowText) continue;

            // Debug log for first few rows
            if (rows.length < 20 || Math.random() < 0.1) console.log(`[PDF Row]: ${fullRowText}`);

            // 1. Relaxed Date Detection (Look for DD/MM or DD MMM or YYYY-MM-DD)
            // Added support for YYYY-MM-DD, DD.MM.YYYY, DD/MM/YY
            const dateRegex = /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})|(\d{1,2}[\/\-\.]\d{1,2}([\/\-\.]\d{2,4})?)|(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(\d{2,4})?)/gi;
            const dateMatches = fullRowText.match(dateRegex);

            const amountMatches = fullRowText.match(/[\d\.,]+/g);

            if (dateMatches && amountMatches) {
                // Find the best date (recent)
                let finalDateISO: string | null = null;
                let originalDateStr = "";

                const currentYear = new Date().getFullYear();
                const minYear = currentYear - 3;

                // Prioritize dates that fall within reasonable range
                for (const d of dateMatches) {
                    const norm = normalizeDate(d);
                    if (norm) {
                        const y = parseInt(norm.split('-')[0]);
                        if (y >= minYear && y <= currentYear + 1) {
                            finalDateISO = norm;
                            originalDateStr = d;
                            break;
                        }
                    }
                }

                // If no recent date found, check if ANY valid date exists
                if (!finalDateISO) {
                    for (const d of dateMatches) {
                        const norm = normalizeDate(d);
                        if (norm) {
                            // It's a valid date structure, just maybe old
                            // We accept it to avoid "reduced results" complain, 
                            // assuming the user might have older files or system date mismatch.
                            // BUT if it's super old (e.g. 2001), we might still want to skip it 
                            // if we are sure it's not a valid transaction.

                            // Let's set a hard floor of 2020.
                            const y = parseInt(norm.split('-')[0]);
                            if (y > 2020) {
                                finalDateISO = norm;
                                originalDateStr = d;
                                break;
                            }
                        }
                    }
                }

                if (!finalDateISO) {
                    // If strictly no valid parseable date, we fallback.
                    // But "Invalid Date" is worse than no transaction.
                    // For now, let's skip row if we can't parse a date.
                    continue;
                }

                // Filter potential amounts
                const validAmounts = amountMatches.filter(m => {
                    if (m.length === 4 && parseInt(m) > 1900 && parseInt(m) < 2100 && !m.includes('.') && !m.includes(',')) return false;
                    return (m.includes('.') || m.includes(',')) || m.length >= 3;
                });

                if (validAmounts.length > 0) {
                    const rawAmount = validAmounts[validAmounts.length - 1];
                    let cleanAmount = 0;
                    let detectedCurrency = "IDR";

                    // ... (Currency parsing logic remains the same, assuming it's robust enough)
                    let tempAmount = rawAmount;
                    const dotCount = (tempAmount.match(/\./g) || []).length;
                    const commaCount = (tempAmount.match(/,/g) || []).length;

                    if (dotCount > 0 && commaCount === 0) {
                        tempAmount = tempAmount.replace(/\./g, '');
                        cleanAmount = parseFloat(tempAmount);
                        detectedCurrency = "IDR";
                    } else if (commaCount > 0 && dotCount === 0) {
                        const parts = tempAmount.split(',');
                        if (parts[parts.length - 1].length === 3) {
                            tempAmount = tempAmount.replace(/,/g, '');
                            detectedCurrency = "USD";
                        } else {
                            tempAmount = tempAmount.replace(',', '.');
                        }
                        cleanAmount = parseFloat(tempAmount);
                    } else if (dotCount > 0 && commaCount > 0) {
                        if (tempAmount.lastIndexOf(',') > tempAmount.lastIndexOf('.')) {
                            tempAmount = tempAmount.replace(/\./g, '').replace(',', '.');
                            detectedCurrency = "IDR";
                        } else {
                            tempAmount = tempAmount.replace(/,/g, '');
                            detectedCurrency = "USD";
                        }
                        cleanAmount = parseFloat(tempAmount);
                    } else {
                        cleanAmount = parseFloat(tempAmount);
                        if (cleanAmount > 5000) detectedCurrency = "IDR";
                    }

                    cleanAmount = -Math.abs(cleanAmount);
                    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    let description = fullRowText;
                    try {
                        description = description.replace(new RegExp(escapeRegExp(originalDateStr), 'i'), "");
                        description = description.replace(new RegExp(escapeRegExp(rawAmount), 'i'), "");
                    } catch (e) {
                        description = description.replace(originalDateStr, "").replace(rawAmount, "");
                    }

                    description = description.replace(/[Rp$€£]/g, "").trim();
                    description = description.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

                    if (description.length < 3) continue;

                    if (!isNaN(cleanAmount) && cleanAmount !== 0) {
                        transactions.push({
                            id: Math.random().toString(36).substr(2, 9),
                            date: finalDateISO,
                            description: description,
                            originalDescription: description,
                            amount: cleanAmount,
                            currency: detectedCurrency
                        });
                    }
                }
            }
        }
    }

    console.log(`[PDF Parser] Finished. Extracted ${transactions.length} transactions.`);
    return transactions;
}

function normalizeDate(dateStr: string): string | null {
    let cleanStr = dateStr.trim();
    cleanStr = cleanStr.replace(/[.,]$/, "");
    const currentYear = new Date().getFullYear();

    const monthMap: Record<string, string> = {
        "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
        "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12",
        "january": "01", "february": "02", "march": "03", "april": "04", "june": "06",
        "july": "07", "august": "08", "september": "09", "october": "10", "november": "11", "december": "12",
        "mei": "05", "agustus": "08", "oktober": "10", "desember": "12" // Add Indonesian specific
    };

    // Handle "20 Jan"
    if (cleanStr.match(/[a-zA-Z]/)) {
        cleanStr = cleanStr.replace(/,/g, '');
        const parts = cleanStr.split(/[\s-]+/);

        if (parts.length >= 2) {
            let day = parts[0];
            let monthStr = parts[1];
            let year = parts[2] || currentYear.toString();

            if (isNaN(parseInt(day)) && !isNaN(parseInt(monthStr))) {
                const temp = day; day = monthStr; monthStr = temp;
            }

            const month = monthMap[monthStr.toLowerCase().substring(0, 3)] || monthMap[monthStr.toLowerCase()];

            if (month) {
                if (year.length === 2) year = "20" + year;
                // Validate day
                const d = parseInt(day);
                if (d > 0 && d <= 31) {
                    return `${year}-${month}-${day.padStart(2, '0')}`;
                }
            }
        }
    }

    // Handle Numeric
    const separators = cleanStr.match(/[\/\-\.]/);
    if (separators) {
        const sep = separators[0];
        const parts = cleanStr.split(sep);

        let day, month, year;

        if (parts.length === 3) {
            // Check if First part is Year (YYYY-MM-DD)
            if (parts[0].length === 4) {
                year = parts[0];
                month = parts[1];
                day = parts[2];
            } else {
                // DD/MM/YYYY
                day = parts[0];
                month = parts[1];
                year = parts[2];
            }
            if (year.length === 2) year = "20" + year;
        } else if (parts.length === 2) {
            day = parts[0];
            month = parts[1];
            year = currentYear.toString();
        } else {
            return null;
        }

        const y = parseInt(year);
        const m = parseInt(month);
        const d = parseInt(day);

        // Sanity Check
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
        }
    }

    return null; // Return null instead of garbage
}

export async function getDebugText(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        let debugOutput = `File: ${file.name}\nPages: ${pdf.numPages}\n\n`;

        // Only dump first 2 pages to avoid massive strings
        const pagesToDump = Math.min(pdf.numPages, 2);

        for (let i = 1; i <= pagesToDump; i++) {
            debugOutput += `--- Page ${i} ---\n`;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Simple Row Grouping for Debug
            const rows: { y: number, text: string }[] = [];
            const TOLERANCE = 4;

            textContent.items.forEach((item: any) => {
                const y = item.transform[5];
                const existingRow = rows.find(r => Math.abs(r.y - y) < TOLERANCE);
                if (existingRow) {
                    existingRow.text += " " + item.str;
                } else {
                    rows.push({ y, text: item.str });
                }
            });

            rows.sort((a, b) => b.y - a.y);

            rows.forEach(r => {
                debugOutput += `[Y=${Math.round(r.y)}] ${r.text}\n`;
            });
            debugOutput += "\n";
        }
        return debugOutput;
    } catch (e: any) {
        return `Error extracting text: ${e.message}`;
    }
}
