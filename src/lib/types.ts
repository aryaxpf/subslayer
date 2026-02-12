export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    originalDescription: string;
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    frequency: "Monthly" | "Yearly" | "Weekly" | "Unknown";
    lastPaymentDate: string;
    logo?: string;
    category: "Entertainment" | "Software" | "Utilities" | "Other";
    status: "Active" | "Cancelled" | "Unknown";
    confidence: number; // 0-1 score of how likely this is a subscription
}

export interface AnalysisResult {
    subscriptions: Subscription[];
    totalMonthlySpend: number;
    yearlyProjection: number;
    processedTransactions: number;
}
