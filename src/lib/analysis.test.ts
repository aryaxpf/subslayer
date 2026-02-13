import { describe, it, expect } from 'vitest';
import { analyzeSubscriptions } from './analysis';
import { Transaction } from './types';

// Helper to create mock transactions
const createTx = (description: string, amount: number, date: string): Transaction => ({
    id: Math.random().toString(),
    date,
    description,
    originalDescription: description,
    amount
});

describe('analyzeSubscriptions', () => {
    it('should detect Netflix subscription (USD) correctly', () => {
        const transactions = [
            createTx('Netflix', -15.00, '2024-01-01'),
            createTx('Netflix', -15.00, '2024-02-01'),
            createTx('Coffee Shop', -5.00, '2024-01-05') // Noise
        ];

        const result = analyzeSubscriptions(transactions);

        expect(result.currency).toBe('USD');
        expect(result.subscriptions).toHaveLength(1);
        expect(result.subscriptions[0].name).toBe('Netflix');
        expect(result.subscriptions[0].amount).toBe(15.00);
        expect(result.totalMonthlySpend).toBe(15.00);
    });

    it('should detect recurring patterns for unknown services', () => {
        const transactions = [
            createTx('Mystery Service', -20.00, '2024-01-01'),
            createTx('Mystery Service', -20.00, '2024-02-01')
        ];

        const result = analyzeSubscriptions(transactions);
        expect(result.subscriptions).toHaveLength(1);
        expect(result.subscriptions[0].name).toBe('Mystery service');
    });

    it('should ignore non-recurring transactions', () => {
        const transactions = [
            createTx('One time purchase', -50.00, '2024-01-01')
        ];

        const result = analyzeSubscriptions(transactions);
        expect(result.subscriptions).toHaveLength(0);
    });

    it('should auto-detect IDR currency based on large amounts', () => {
        const transactions = [
            createTx('Indihome', -315000, '2024-01-01'),
            createTx('Indihome', -315000, '2024-02-01')
        ];

        const result = analyzeSubscriptions(transactions);
        expect(result.currency).toBe('IDR');
        expect(result.subscriptions[0].currency).toBe('IDR');
        expect(result.subscriptions[0].amount).toBe(315000);
    });

    it('should default to IDR if ANY subscription is clearly IDR (>10,000)', () => {
        // Mixed scenario: Small "USD-like" amount but large IDR amount present
        const transactions = [
            createTx('Netflix', -15, '2024-01-01'), // Could be $15 or Rp 15
            createTx('Netflix', -15, '2024-02-01'),
            createTx('PLN Token', -50000, '2024-01-05'), // Clearly IDR
            createTx('PLN Token', -50000, '2024-02-05')
        ];

        const result = analyzeSubscriptions(transactions);
        expect(result.currency).toBe('IDR');
        // Netflix should be treated as 15 IDR (effectively 0) or just listed as is
        // In reality, 15 IDR is impossible, but the logic should hold the Currency tag
        expect(result.subscriptions.find(s => s.name === 'Netflix')?.currency).toBe('IDR');
    });
});
