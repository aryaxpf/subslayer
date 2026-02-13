"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { UploadCloud, FileText, X, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Transaction } from "@/lib/types"
import { TornadoLoader } from "@/components/tornado-loader"

interface FileUploadProps {
    onDataParsed: (transactions: Transaction[]) => void
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles])
        setError(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 3
    })

    const processFiles = async () => {
        setIsProcessing(true)
        setError(null)
        const allTransactions: Transaction[] = []

        try {
            // Dynamic import for PDF parser to avoid loading it initially
            const { parsePDF } = await import("@/lib/pdf-parser");

            for (const file of files) {
                if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    await new Promise<void>((resolve, reject) => {
                        Papa.parse(file, {
                            header: true,
                            skipEmptyLines: true,
                            complete: (results) => {
                                // Normalize keys (handle different bank formats)
                                const parsed = results.data.map((row: any) => {
                                    let rawAmount = row.Amount || row.amount || row.Debit || row.debit || row.Value || "0"
                                    let detectedCurrency = "USD"; // Default fallback

                                    // Handle string amounts with currency symbols or separators
                                    if (typeof rawAmount === 'string') {
                                        // Detect currency before cleaning
                                        if (rawAmount.includes("Rp") || rawAmount.includes("IDR")) detectedCurrency = "IDR";
                                        else if (rawAmount.includes("€") || rawAmount.includes("EUR")) detectedCurrency = "EUR";
                                        else if (rawAmount.includes("£") || rawAmount.includes("GBP")) detectedCurrency = "GBP";
                                        else if (rawAmount.includes("$") || rawAmount.includes("USD")) detectedCurrency = "USD";
                                        else {
                                            // No explicit symbol found -> Smart Inference
                                            let inferred = false;

                                            // 1. Keyword Heuristic (Prioritize IDR context)
                                            const lowerDesc = (row.Description || row.description || "").toLowerCase();
                                            if (["biaya", "admin", "trf", "pajak", "materai", "transfer", "qris", "gopay", "ovo", "dana", "shopeepay", "langganan", "tagihan", "pembayaran", "otomatis"].some(k => lowerDesc.includes(k))) {
                                                detectedCurrency = "IDR";
                                                inferred = true;
                                            }

                                            // 2. Format Heuristic (Check for Separators)
                                            if (!inferred) {
                                                const dotCount = (rawAmount.match(/\./g) || []).length;
                                                const commaCount = (rawAmount.match(/,/g) || []).length;

                                                if (dotCount >= 1 && commaCount === 0) {
                                                    // 150.000 -> IDR (Dots used as thousands separator)
                                                    detectedCurrency = "IDR";
                                                    inferred = true;
                                                } else if (dotCount > 0 && commaCount > 0) {
                                                    // Mixed separators: determine which is last (decimal)
                                                    const lastDot = rawAmount.lastIndexOf('.');
                                                    const lastComma = rawAmount.lastIndexOf(',');

                                                    if (lastComma > lastDot) {
                                                        // 1.500,00 -> IDR/EUR (Comma is decimal)
                                                        detectedCurrency = "IDR"; // Default to IDR over EUR for this app context
                                                        inferred = true;
                                                    } else {
                                                        // 1,500.00 -> USD (Dot is decimal)
                                                        detectedCurrency = "USD";
                                                        inferred = true;
                                                    }
                                                }
                                            }

                                            // 3. Magnitude Heuristic (The "Jumbo" Rule)
                                            if (!inferred) {
                                                // Parse strictly as generic number (remove all non-digits)
                                                const cleanForMag = rawAmount.replace(/[^0-9]/g, "");
                                                const magVal = parseFloat(cleanForMag);

                                                // If we have no separators, we interpret the raw number
                                                if (!rawAmount.includes(".") && !rawAmount.includes(",")) {
                                                    // Pure integer string: "150000"
                                                    if (magVal > 1000) {
                                                        // > 1000 is likely IDR. 1000 USD is huge. 
                                                        // Exception: 2024 (Year). But text usually distinct.
                                                        detectedCurrency = "IDR";
                                                    }
                                                } else {
                                                    // Has separators but ambiguous? 
                                                    // If we are here, inferred is false (so dotCount=0 OR commaCount=0 but not IDR-dot-only match?)
                                                    // If commaCount >= 1 and dotCount === 0: "1,000" or "1,50"
                                                    // Hard to distinguish 1,000 (USD) from 1,00 (IDR decimal?? IDR usually ,00).
                                                    // Let's rely on magnitude of the *parsed* value assuming USD first? No.
                                                }
                                            }
                                        }

                                        // Remove currency symbols and spaces
                                        rawAmount = rawAmount.replace(/[Rp$€£A-Z\s]/g, '');

                                        // Currency-specific parsing
                                        if (detectedCurrency === 'IDR') {
                                            // IDR often uses dots for thousands and comma for decimal: 150.000,00 or Just 150.000
                                            // Remove all dots
                                            rawAmount = rawAmount.replace(/\./g, '');
                                            // Replace comma with dot
                                            rawAmount = rawAmount.replace(',', '.');
                                        } else if (detectedCurrency === 'EUR') {
                                            // Fallback parsing for Euro style 1.000,00 
                                            if (rawAmount.includes(',') && rawAmount.includes('.')) {
                                                if (rawAmount.indexOf('.') < rawAmount.indexOf(',')) {
                                                    // 1.000,00
                                                    rawAmount = rawAmount.replace(/\./g, '').replace(',', '.');
                                                }
                                            } else if (rawAmount.includes(',')) {
                                                // 10,00 -> 10.00
                                                rawAmount = rawAmount.replace(',', '.');
                                            }
                                        } else {
                                            // USD/GBP style: 1,000.00
                                            rawAmount = rawAmount.replace(/,/g, '');
                                        }
                                    }

                                    let amount = parseFloat(rawAmount)

                                    // Make sure it's negative if it's an expense (for Analysis)
                                    // If column is explicitly "Debit", it's an expense (negative)
                                    // If column is "Credit", it's income (positive)
                                    // If column is generic "Amount", for "Subscription Slayer", we assume it's an expense list. 
                                    // So we default to negative to ensure our Analysis picks it up (which usually expects negative transactions).
                                    // However, Analysis has been updated to accept positive amounts too.
                                    // But key heuristic: consistency.
                                    if (row.Debit || row.debit) {
                                        amount = -Math.abs(amount);
                                    } else if (row.Credit || row.credit) {
                                        amount = Math.abs(amount);
                                    } else {
                                        // Ambiguous "Amount" column -> Force negative to align with typical bank export "money out"
                                        amount = -Math.abs(amount);
                                    }

                                    const description = row.Description || row.description || row.Memo || row.memo || "Unknown"
                                    const date = row.Date || row.date || row.Posted || new Date().toISOString()

                                    return {
                                        id: Math.random().toString(36).substr(2, 9),
                                        date,
                                        description,
                                        originalDescription: description,
                                        amount: isNaN(amount) ? 0 : amount,
                                        currency: detectedCurrency
                                    } as Transaction
                                })
                                allTransactions.push(...parsed)
                                resolve()
                            },
                            error: (err: Error) => { // Type the error explicitly
                                reject(err)
                            }
                        })
                    })
                } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    try {
                        const pdfTransactions = await parsePDF(file);
                        if (pdfTransactions.length > 0) {
                            allTransactions.push(...pdfTransactions);
                        } else {
                            console.warn(`No transactions found in PDF: ${file.name}`);
                        }
                    } catch (pdfErr) {
                        console.error("Error parsing PDF", pdfErr);
                        setError(`Failed to parse PDF: ${file.name}`);
                    }
                }
            }

            if (allTransactions.length === 0) {
                setError("No valid transactions found. Please check your file format.")
            } else {
                onDataParsed(allTransactions)
            }
        } catch (err) {
            setError("Failed to process files. Please try again.")
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="w-full space-y-4">
            {isProcessing ? (
                <div className="w-full min-h-[400px] flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <TornadoLoader />
                    <p className="text-sm text-center text-muted-foreground mt-4 animate-pulse">
                        {files.some(f => f.type === 'application/pdf') ? "Parsing PDF... This runs locally in your browser." : "Analyzing financial patterns..."}
                    </p>
                </div>
            ) : (
                <>
                    <div
                        {...getRootProps()}
                        className={cn(
                            "flex flex-col items-center justify-center w-full min-h-[250px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                            isDragActive ? "border-primary bg-muted/50" : "border-muted-foreground/25",
                            "p-10 text-center space-y-4"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="p-4 bg-primary/10 rounded-full">
                            <UploadCloud className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Drop your last 2-3 months of statements</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Supports CSV or PDF from any bank or e-wallet
                            </p>
                        </div>
                        {error && (
                            <div className="flex items-center text-destructive text-sm bg-destructive/10 p-2 rounded">
                                {error}
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-md shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    className="w-full mt-4"
                                    size="lg"
                                    onClick={processFiles}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Analyzing..." : "Analyze Subscriptions"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {
                        error && (
                            <div className="space-y-3">
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                                    {error}
                                </div>

                                {/* Debug Toggle */}
                                {error.includes("valid transactions") && (
                                    <div className="text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={async () => {
                                                setIsProcessing(true);
                                                const { getDebugText } = await import("@/lib/pdf-parser");
                                                const text = await getDebugText(files[0]);
                                                alert("Please Copy & Paste this into the Chat:\n\n" + text.substring(0, 2000) + "...");
                                                console.log(text); // Also log to console
                                                setIsProcessing(false);
                                            }}
                                        >
                                            Diagnose PDF Issue
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Click this to extract raw text and show us the format.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </>
            )}
        </div >
    )
}
