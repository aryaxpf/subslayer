import { Transaction, Subscription, AnalysisResult } from "./types";
import { getServiceKnowledge } from "./subscriptions";

/**
 * Normalizes a transaction description to remove dates, random IDs, etc.
 * E.g., "NETFLIX 234234 02/12" -> "NETFLIX"
 */
function normalizeDescription(desc: string): string {
    return desc
        .toLowerCase()
        .replace(/\d{2}\/\d{2}/g, "") // Remove dates like 02/12
        .replace(/\d+/g, "") // Remove numbers
        .replace(/\*/g, "") // Remove asterisks
        .replace(/bill payment/i, "")
        .replace(/purchase/i, "")
        .replace(/recurring/i, "") // Sometimes helpful, but we want the base name
        .trim();
}

/**
 * Main function to analyze transactions and detect subscriptions.
 */
export function analyzeSubscriptions(transactions: Transaction[]): AnalysisResult {
    const potentialSubs = new Map<string, Transaction[]>();

    // Group by normalized description
    transactions.forEach((t) => {
        // Filter out positive amounts (income) ONLY if we align on negative-expense convention.
        // But for "Amount" column CSVs, expenses might be positive.
        // Let's rely on the file-upload normalization to handle signs if possible, 
        // OR just analyze everything and assume the user uploaded relevant data.

        const norm = normalizeDescription(t.description);
        // Ignore very short descriptions
        if (norm.length < 3) return;

        if (!potentialSubs.has(norm)) {
            potentialSubs.set(norm, []);
        }
        potentialSubs.get(norm)?.push(t);
    });

    // Currency Exchange Rates (Static approximation)
    const RATES: Record<string, number> = {
        "IDR": 1,
        "USD": 16000,
        "EUR": 17000,
        "GBP": 20000,
        "SGD": 12000,
        "AUD": 10500
    };

    const subscriptions: Subscription[] = [];
    const spendByCurrency: Record<string, number> = { "IDR": 0, "USD": 0 };

    potentialSubs.forEach((group, normDesc) => {
        // Sort by date (newest first)
        group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        let isSub = false;
        let detectedName = normDesc;
        let detectedCategory: Subscription["category"] = "Other";
        let detectedLogo = undefined;
        let detectedCancellationUrl = undefined;
        let detectedKnowledgeId = undefined; // New
        let detectedCurrency = group[0].currency || "USD";

        if (!group[0].currency) {
            // Fallback Heuristic if no symbol found
            if (Math.abs(group[0].amount) > 10000) detectedCurrency = "IDR";
        }

        // Check against NEW Knowledge Base
        const knownService = getServiceKnowledge(normDesc);

        if (knownService) {
            isSub = true;
            detectedName = knownService.name;
            detectedCategory = knownService.category;
            detectedLogo = knownService.logo;
            detectedCancellationUrl = knownService.cancellationUrl;
            detectedKnowledgeId = knownService.id; // New
        }

        // If not known, use recurrence heuristic
        if (!isSub && group.length >= 2) {
            // Calculate intervals
            // For MVP, if same amount repeated > 1 time, flag it as potential
            const amounts = group.map(t => Math.abs(t.amount));
            const uniqueAmounts = new Set(amounts);

            // If variety of amounts is low relative to count, likely a sub
            if (uniqueAmounts.size / group.length <= 0.5) {
                isSub = true;
            }
        }

        if (isSub) {
            const latestTransaction = group[0];
            const amount = Math.abs(latestTransaction.amount);

            subscriptions.push({
                id: latestTransaction.id || Math.random().toString(36).substr(2, 9),
                name: detectedName.charAt(0).toUpperCase() + detectedName.slice(1),
                amount: amount,
                currency: detectedCurrency,
                frequency: "Monthly", // Assumption, would need date analysis
                lastPaymentDate: latestTransaction.date,
                logo: detectedLogo,
                category: detectedCategory,
                status: "Active",
                confidence: knownService ? 0.9 : 0.6,
                cancellationUrl: detectedCancellationUrl,
                knowledgeId: detectedKnowledgeId
            });

            // Track spend (normalize to IDR for comparison dominance)
            const rate = RATES[detectedCurrency] || RATES["USD"]; // Default to USD rate if unknown
            // Note: we track raw sums per currency for dominant currency detection
            if (!spendByCurrency[detectedCurrency]) spendByCurrency[detectedCurrency] = 0;
            spendByCurrency[detectedCurrency] += amount;
        }
    });

    // Determine Dominant Currency (Simple: which has more raw count? Or value? Let's use Value converted to IDR)
    let maxVal = 0;
    let dominantCurrency = "IDR";

    // Calculate total value in IDR for all currencies found
    for (const curr in spendByCurrency) {
        const rate = RATES[curr] || 16000;
        const valInIDR = spendByCurrency[curr] * (curr === "IDR" ? 1 : rate);
        if (valInIDR > maxVal) {
            maxVal = valInIDR;
            dominantCurrency = curr;
        }
    }

    // Default to USD if very little spend and no IDR
    if (maxVal === 0) dominantCurrency = "USD";

    // Calculate Total Monthly Spend in Dominant Currency
    let totalMonthlySpend = 0;
    subscriptions.forEach(sub => {
        if (sub.currency === dominantCurrency) {
            totalMonthlySpend += sub.amount;
        } else {
            // Convert to dominant
            const subRateToIDR = RATES[sub.currency] || 16000;
            const domRateToIDR = RATES[dominantCurrency] || 16000;
            // Amount in IDR -> Amount in Dominant
            const valInIDR = sub.amount * (sub.currency === "IDR" ? 1 : subRateToIDR);
            const valInDom = valInIDR / (dominantCurrency === "IDR" ? 1 : domRateToIDR);
            totalMonthlySpend += valInDom;
        }
    });

    return {
        subscriptions: subscriptions.sort((a, b) => b.amount - a.amount),
        totalMonthlySpend,
        yearlyProjection: totalMonthlySpend * 12,
        processedTransactions: transactions.length,
        currency: dominantCurrency
    };
}
