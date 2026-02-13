import jsPDF from "jspdf"
import { formatCurrency } from "./utils"

interface CancellationLetterProps {
    subscriptionName: string;
    subscriptionAmount: number;
    currency: string;
    userName?: string;
    userEmail?: string;
    accountNumber?: string;
    companyAddress?: string; // Optional, maybe for future
}

export function generateCancellationLetter(data: CancellationLetterProps) {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Configuration
    const margin = 20;
    let y = 20;
    const lineHeight = 7;

    function addText(text: string, fontSize: number = 11, font: string = "helvetica", style: string = "normal") {
        doc.setFont(font, style);
        doc.setFontSize(fontSize);
        const splitText = doc.splitTextToSize(text, 170); // Wrap width
        doc.text(splitText, margin, y);
        y += (splitText.length * lineHeight) + 2;
    }

    function addGap(size: number = 10) {
        y += size;
    }

    // --- Content Start ---

    // Sender Info (Top Right or Left - keeping standard Left for simplicity)
    addText(data.userName || "[Your Name]", 12, "helvetica", "bold");
    addText(data.userEmail || "[Your Email]");
    // addText("[Your Address]"); // skipped for privacy/simplicity
    addText(today);

    addGap(5);

    // Recipient Info
    addText("To:", 12, "helvetica", "bold");
    addText(`${data.subscriptionName} Cancellation Department`, 12);
    addText("Customer Support / Billing Team");

    addGap(10);

    // Subject
    addText(`RE: Formal Request to Cancel Subscription for ${data.subscriptionName}`, 12, "helvetica", "bold");

    addGap(5);

    // Salutation
    addText("To Whom It May Concern,");

    addGap(5);

    // Body Paragraph 1
    addText(`I am writing to formally request the immediate cancellation of my subscription with ${data.subscriptionName}. Please terminate my account and stop all future scheduled payments effective immediately.`);

    addGap(3);

    // Account Details Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, 170, 35, 'F');
    doc.rect(margin, y, 170, 35, 'S'); // specific box for details

    let boxY = y + 8;
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text(`Account Holder : ${data.userName || "[Name on Account]"}`, margin + 5, boxY);
    boxY += 6;
    doc.text(`Email Address  : ${data.userEmail || "[Email on Account]"}`, margin + 5, boxY);
    boxY += 6;
    doc.text(`Service        : ${data.subscriptionName}`, margin + 5, boxY);
    boxY += 6;
    doc.text(`Current Cost   : ${formatCurrency(data.subscriptionAmount, data.currency)}`, margin + 5, boxY);

    y += 40; // Skip past box

    // Body Paragraph 2
    addText("Please consider this letter as my written notice of cancellation. I revoke any authorization for future debits to my bank account or credit card for this service.");

    // Body Paragraph 3
    addText("I would appreciate a written confirmation via email stating that my account has been closed and that no further charges will be applied.");

    addGap(10);

    // Sign Off
    addText("Sincerely,");

    addGap(15); // Space for signature

    addText("_______________________");
    addText(data.userName || "[Signature]");

    // Save
    const safeName = data.subscriptionName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    doc.save(`cancellation_letter_${safeName}.pdf`);
}

import { Subscription } from "./types"

export function generateCancellationHitList(subscriptions: Subscription[], currency: "USD" | "IDR") {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Subscription Slayer", 20, 25);

    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38); // Red
    doc.text("CANCELLATION HIT LIST", 20, 35);

    doc.setTextColor(0, 0, 0); // Reset
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${today}`, 20, 42);
    doc.text(`Total to Cancel: ${subscriptions.length} items`, 20, 48);

    let y = 60;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 8, 170, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("SERVICE", 25, y);
    doc.text("COST", 80, y);
    doc.text("ACTION REQUIRED", 120, y);

    y += 10;

    // Items
    subscriptions.forEach((sub, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${sub.name}`, 25, y);

        doc.setFont("helvetica", "normal");
        doc.text(formatCurrency(sub.amount, sub.currency), 80, y);

        // Action / Kill Switch
        if (sub.cancellationUrl) {
            doc.setTextColor(0, 0, 255);
            doc.textWithLink("Cancel Link (Click Here)", 120, y, { url: sub.cancellationUrl });
        } else {
            doc.setTextColor(100, 100, 100);
            doc.text("Search 'Cancel " + sub.name + "'", 120, y);
        }

        doc.setTextColor(0, 0, 0);
        y += 10;

        // Add step summary if known
        if (sub.knowledgeId) { // We'd need to fetch steps, but let's keep it simple for now
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            const guideUrl = `http://localhost:3000/how-to-cancel/${sub.knowledgeId}`; // Valid assumption for local?
            // Actually, PDF links to local are tricky. Let's just say "Guide Available"
            doc.text("Step-by-step guide available in app.", 25, y - 4);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
        }

        // Draw line
        doc.setDrawColor(230, 230, 230);
        doc.line(20, y - 7, 190, y - 7);

        // Page break check
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    // Total Savings
    y += 10;
    const totalSavings = subscriptions.reduce((sum, sub) => {
        // Simple distinct sum, ignoring currency mixed for now (assuming mostly user's dominant)
        return sum + sub.amount; // Mixed currency sum is chemically unstable but for checklist visually it's fine-ish.
    }, 0);

    // Actually we should separate currency sums
    const idrSavings = subscriptions.filter(s => s.currency === "IDR").reduce((sum, s) => sum + s.amount, 0);
    const usdSavings = subscriptions.filter(s => s.currency === "USD").reduce((sum, s) => sum + s.amount, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECTED MONTHLY SAVINGS:", 20, y);

    y += 8;
    if (idrSavings > 0) doc.text(`- ${formatCurrency(idrSavings, "IDR")}`, 25, y);
    if (usdSavings > 0) {
        y += (idrSavings > 0 ? 6 : 0);
        doc.text(`- ${formatCurrency(usdSavings, "USD")}`, 25, y);
    }

    doc.save("subscription_hit_list.pdf");
}
