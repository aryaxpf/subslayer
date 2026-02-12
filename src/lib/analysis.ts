import { Transaction, Subscription, AnalysisResult } from "./types";

const KNOWN_SUBSCRIPTIONS: Record<string, Partial<Subscription>> = {
    "netflix": { name: "Netflix", category: "Entertainment", logo: "/logos/netflix.png" },
    "spotify": { name: "Spotify", category: "Entertainment", logo: "/logos/spotify.png" },
    "adobe": { name: "Adobe Creative Cloud", category: "Software", logo: "/logos/adobe.png" },
    "aws": { name: "Amazon Web Services", category: "Software", logo: "/logos/aws.png" },
    "chatgpt": { name: "ChatGPT Plus", category: "Software", logo: "/logos/openai.png" },
    "openai": { name: "OpenAI API", category: "Software", logo: "/logos/openai.png" },
    "github": { name: "GitHub", category: "Software", logo: "/logos/github.png" },
    "vercel": { name: "Vercel", category: "Software", logo: "/logos/vercel.png" },
    "youtube premium": { name: "YouTube Premium", category: "Entertainment", logo: "/logos/youtube.png" },
    "google storage": { name: "Google One", category: "Utilities", logo: "/logos/google.png" },
    "icloud": { name: "Apple iCloud", category: "Utilities", logo: "/logos/apple.png" },
    "apple.com/bill": { name: "Apple Service", category: "Utilities", logo: "/logos/apple.png" },
    "prime video": { name: "Prime Video", category: "Entertainment", logo: "/logos/primevideo.png" },
    "disney+": { name: "Disney+", category: "Entertainment", logo: "/logos/disney.png" },
    "hulu": { name: "Hulu", category: "Entertainment", logo: "/logos/hulu.png" },
    "hbo max": { name: "HBO Max", category: "Entertainment", logo: "/logos/hbo.png" },
    "slack": { name: "Slack", category: "Software", logo: "/logos/slack.png" },
    "zoom": { name: "Zoom", category: "Software", logo: "/logos/zoom.png" },
    "notion": { name: "Notion", category: "Software", logo: "/logos/notion.png" },
    "figma": { name: "Figma", category: "Software", logo: "/logos/figma.png" },
    "linear": { name: "Linear", category: "Software", logo: "/logos/linear.png" },
    "cursor": { name: "Cursor", category: "Software", logo: "/logos/cursor.png" },
    "anthropic": { name: "Anthropic", category: "Software", logo: "/logos/anthropic.png" },
    "midjourney": { name: "Midjourney", category: "Entertainment", logo: "/logos/midjourney.png" },
    "twitter": { name: "X Premium", category: "Software", logo: "/logos/x.png" },
    "x premium": { name: "X Premium", category: "Software", logo: "/logos/x.png" },
    "linkedin": { name: "LinkedIn Premium", category: "Software", logo: "/logos/linkedin.png" },
};

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
        // Filter out positive amounts (income)
        if (t.amount > 0) return;

        const norm = normalizeDescription(t.description);
        // Ignore very short descriptions
        if (norm.length < 3) return;

        if (!potentialSubs.has(norm)) {
            potentialSubs.set(norm, []);
        }
        potentialSubs.get(norm)?.push(t);
    });

    const subscriptions: Subscription[] = [];
    let totalMonthlySpend = 0;

    potentialSubs.forEach((group, normDesc) => {
        // Heuristic 1: Recurring logic
        // If we have at least 2 transactions with same amount or within 10% variance
        // AND they are roughly 30 days apart (or 1 year)

        // Sort by date (assuming ISO date strings or comparable)
        group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Check simpler heuristic: Same amount appearing multiple times?
        // Or check against KNOWN_SUBSCRIPTIONS list

        let isSub = false;
        let detectedName = normDesc;
        let detectedCategory: Subscription["category"] = "Other";
        let detectedLogo = undefined;

        // Check if it matches a known subscription
        const knownKey = Object.keys(KNOWN_SUBSCRIPTIONS).find(k => normDesc.includes(k));
        if (knownKey) {
            isSub = true;
            const info = KNOWN_SUBSCRIPTIONS[knownKey];
            detectedName = info.name || detectedName;
            detectedCategory = info.category || "Other";
            detectedLogo = info.logo;
        }

        // If not known, use recurrence heuristic
        if (!isSub && group.length >= 2) {
            // Calculate intervals
            // For MVP, if same amount repeated > 1 time, flag it as potential
            const amounts = group.map(t => Math.abs(t.amount));
            const uniqueAmounts = new Set(amounts);

            // If variety of amounts is low relative to count, likely a sub
            if (uniqueAmounts.size / group.length < 0.5) {
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
                currency: "USD", // Assumption for now
                frequency: "Monthly", // Assumption, would need date analysis
                lastPaymentDate: latestTransaction.date,
                logo: detectedLogo,
                category: detectedCategory,
                status: "Active",
                confidence: knownKey ? 0.9 : 0.6
            });

            totalMonthlySpend += amount;
        }
    });

    return {
        subscriptions: subscriptions.sort((a, b) => b.amount - a.amount),
        totalMonthlySpend,
        yearlyProjection: totalMonthlySpend * 12,
        processedTransactions: transactions.length
    };
}
