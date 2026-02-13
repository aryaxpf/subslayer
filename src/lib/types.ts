export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency?: string; // Detected currency for this specific transaction
    originalDescription: string;
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string; // "USD", "IDR", "EUR", etc.
    frequency: "Monthly" | "Yearly" | "Weekly" | "Unknown";
    lastPaymentDate: string;
    logo?: string;
    category: "Entertainment" | "Software" | "Utilities" | "Lifestyle" | "Other";
    status: "Active" | "Cancelled" | "Unknown";
    confidence: number; // 0-1 score of how likely this is a subscription
    cancellationUrl?: string; // Direct link to cancel
    knowledgeId?: string; // Slug for the How-To page
}

export interface ServiceAlternative {
    name: string; // "Annual Plan"
    price: string; // "$9.99/mo"
    savings: string; // "Save 20%"
}

export interface AnalysisResult {
    subscriptions: Subscription[];
    totalMonthlySpend: number; // In dominant currency
    yearlyProjection: number; // In dominant currency
    processedTransactions: number;
    currency: string; // The "Dominant" currency for totals
}

export interface ServiceKnowledge {
    id: string; // "netflix"
    name: string; // "Netflix"
    category: Subscription["category"];
    logo: string;
    description: string;
    url: string; // Homepage
    cancellationUrl: string; // The "Kill Switch"
    cancellationMethod: "Online" | "Phone" | "Email" | "Letter";
    steps: string[]; // Step-by-step guide
    keywords: string[]; // Matchers
    downgradeOptions?: ServiceAlternative[]; // New: Money saving alternatives
}
