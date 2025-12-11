export interface User {
  id: string;
  username: string;
  email: string;
}

export enum AccountType {
  BANK = 'Bank',
  CASH = 'Cash',
  INVESTMENT = 'Investment',
  CREDIT = 'Credit Card'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
  TRANSFER = 'Transfer'
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
}

export interface Stock {
  id: string;
  symbol: string; // e.g., 2330.TW, AAPL
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  lastUpdated?: string;
}

export interface FinancialContextType {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  stocks: Stock[];
  login: (username: string, email: string) => void;
  logout: () => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addStock: (stock: Omit<Stock, 'id'>) => void;
  updateStock: (stock: Stock) => void;
  deleteStock: (id: string) => void;
  updateStockPrices: () => Promise<void>;
  isUpdatingStocks: boolean;
}