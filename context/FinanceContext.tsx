import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, Stock, Transaction, User, FinancialContextType, TransactionType } from '../types';
import { DEMO_ACCOUNTS, DEMO_STOCKS, DEMO_TRANSACTIONS } from '../constants';
import { fetchLatestStockPrices } from '../services/geminiService';
import { auth, db } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';

const FinanceContext = createContext<FinancialContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isUpdatingStocks, setIsUpdatingStocks] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        });
      } else {
        // User is signed out
        setUser(null);
        setAccounts([]);
        setTransactions([]);
        setStocks([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen for Data Changes (Firestore) when user is logged in
  useEffect(() => {
    if (!user) return;

    // Accounts Listener
    const qAccounts = query(collection(db, 'users', user.id, 'accounts'));
    const unsubAccounts = onSnapshot(qAccounts, (snapshot) => {
      const accData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
      // Sort if needed or just set
      setAccounts(accData);
    });

    // Transactions Listener
    const qTransactions = query(collection(db, 'users', user.id, 'transactions'), orderBy('date', 'desc'));
    const unsubTrans = onSnapshot(qTransactions, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txData);
    });

    // Stocks Listener
    const qStocks = query(collection(db, 'users', user.id, 'stocks'));
    const unsubStocks = onSnapshot(qStocks, (snapshot) => {
      const stockData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stock));
      setStocks(stockData);
    });

    return () => {
      unsubAccounts();
      unsubTrans();
      unsubStocks();
    };
  }, [user?.id]);

  const login = async (username: string, email: string) => {
    // Note: In a real UI, you'd ask for a password. 
    // For this demo structure, we'll try to sign in, if it fails (user not found), we create one.
    // We are using 'username' as password for this simplified demo or a default one.
    // WARNING: This is for demo simplicity to fit existing UI. Use proper password fields in production.
    const demoPassword = "password123"; 

    try {
      await signInWithEmailAndPassword(auth, email, demoPassword);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // Try creating account
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, demoPassword);
          // Initialize with demo data for new users
          const batch = [];
          // Add Demo Accounts
          for (const acc of DEMO_ACCOUNTS) {
             await addDoc(collection(db, 'users', cred.user.uid, 'accounts'), { ...acc, id: null }); // let firestore gen ID
          }
          // Add Demo Stocks
          for (const s of DEMO_STOCKS) {
             await addDoc(collection(db, 'users', cred.user.uid, 'stocks'), { ...s, id: null });
          }
          // Add Demo Transactions
          for (const t of DEMO_TRANSACTIONS) {
             await addDoc(collection(db, 'users', cred.user.uid, 'transactions'), { ...t, id: null });
          }
        } catch (createError) {
          console.error("Error creating user", createError);
          alert("Login failed: " + (createError as any).message);
        }
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.id, 'accounts'), account);
  };

  const deleteAccount = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.id, 'accounts', id));
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.id, 'transactions'), transaction);

    // Update Account Balance Logic (Client side calculation is risky, better to use Cloud Functions, but doing here for simplicity)
    const accountRef = doc(db, 'users', user.id, 'accounts', transaction.accountId);
    const account = accounts.find(a => a.id === transaction.accountId);
    
    if (account) {
      let newBalance = account.balance;
      if (transaction.type === TransactionType.INCOME) newBalance += transaction.amount;
      if (transaction.type === TransactionType.EXPENSE) newBalance -= transaction.amount;
      await updateDoc(accountRef, { balance: newBalance });
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    
    // Revert balance
    const accountRef = doc(db, 'users', user.id, 'accounts', tx.accountId);
    const account = accounts.find(a => a.id === tx.accountId);

    if (account) {
      let newBalance = account.balance;
      if (tx.type === TransactionType.INCOME) newBalance -= tx.amount;
      if (tx.type === TransactionType.EXPENSE) newBalance += tx.amount;
      await updateDoc(accountRef, { balance: newBalance });
    }

    await deleteDoc(doc(db, 'users', user.id, 'transactions', id));
  };

  const addStock = async (stock: Omit<Stock, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.id, 'stocks'), stock);
  };

  const updateStock = async (stock: Stock) => {
    if (!user) return;
    const stockRef = doc(db, 'users', user.id, 'stocks', stock.id);
    await setDoc(stockRef, stock);
  };

  const deleteStock = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.id, 'stocks', id));
  };

  const updateStockPrices = async () => {
    if (!user) return;
    setIsUpdatingStocks(true);
    try {
      const updates = await fetchLatestStockPrices(stocks);
      if (updates.length > 0) {
        // Update in Firestore
        const promises = stocks.map(async (s) => {
           const update = updates.find(u => u.symbol?.toUpperCase() === s.symbol.toUpperCase());
           if (update) {
              const stockRef = doc(db, 'users', user.id, 'stocks', s.id);
              await updateDoc(stockRef, { 
                currentPrice: update.currentPrice, 
                lastUpdated: new Date().toISOString() 
              });
           }
        });
        await Promise.all(promises);
      }
    } catch (e) {
      console.error("Failed to update stocks", e);
    } finally {
      setIsUpdatingStocks(false);
    }
  };

  return (
    <FinanceContext.Provider value={{
      user, accounts, transactions, stocks,
      login, logout,
      addAccount, deleteAccount,
      addTransaction, deleteTransaction,
      addStock, updateStock, deleteStock,
      updateStockPrices, isUpdatingStocks
    }}>
      {!loading && children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};