import { Account, AccountType, Stock, Transaction, TransactionType } from "./types";

export const CATEGORIES = {
  [TransactionType.INCOME]: ['Salary', 'Bonus', 'Dividend', 'Investment', 'Other'],
  [TransactionType.EXPENSE]: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Travel'],
  [TransactionType.TRANSFER]: ['Transfer']
};

export const DEMO_ACCOUNTS: Account[] = [
  { id: '1', name: 'CTBC Bank', type: AccountType.BANK, balance: 150000, currency: 'TWD' },
  { id: '2', name: 'Wallet Cash', type: AccountType.CASH, balance: 3500, currency: 'TWD' },
  { id: '3', name: 'Firstrade', type: AccountType.INVESTMENT, balance: 5000, currency: 'USD' },
];

export const DEMO_STOCKS: Stock[] = [
  { id: '1', symbol: '2330.TW', name: 'TSMC', quantity: 1000, avgCost: 500, currentPrice: 500, currency: 'TWD' },
  { id: '2', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgCost: 150, currentPrice: 150, currency: 'USD' },
  { id: '3', symbol: '0050.TW', name: 'Yuanta 0050', quantity: 2000, avgCost: 120, currentPrice: 120, currency: 'TWD' },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: '1', accountId: '1', date: new Date().toISOString().split('T')[0], amount: 50000, type: TransactionType.INCOME, category: 'Salary', note: 'Monthly Salary' },
  { id: '2', accountId: '2', date: new Date().toISOString().split('T')[0], amount: 120, type: TransactionType.EXPENSE, category: 'Food', note: 'Lunch' },
  { id: '3', accountId: '2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 50, type: TransactionType.EXPENSE, category: 'Transportation', note: 'MRT' },
  { id: '4', accountId: '1', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], amount: 2000, type: TransactionType.EXPENSE, category: 'Utilities', note: 'Internet Bill' },
];
