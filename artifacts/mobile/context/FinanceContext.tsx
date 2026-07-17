import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
}

export interface Budget {
  id: string;
  category: Category;
  amount: number;
  month: number; // 1-12
  year: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  currency: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  utilities: 'Utilities',
  healthcare: 'Healthcare',
  education: 'Education',
  other: 'Other',
};

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  chatHistory: ChatMessage[];
  profile: UserProfile;
  isLoaded: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (b: Omit<Budget, 'id'>) => void;
  editBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addMessage: (m: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  clearAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = '@finbuddy_v1';

function genId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  monthlyIncome: 0,
  currency: 'USD',
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.transactions) setTransactions(data.transactions);
          if (data.budgets) setBudgets(data.budgets);
          if (data.chatHistory) setChatHistory(data.chatHistory);
          if (data.profile) setProfile({ ...DEFAULT_PROFILE, ...data.profile });
        }
      } catch {}
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions, budgets, chatHistory, profile }),
    ).catch(() => {});
  }, [transactions, budgets, chatHistory, profile, isLoaded]);

  const addTransaction = (t: Omit<Transaction, 'id'>) =>
    setTransactions(prev => [{ ...t, id: genId() }, ...prev]);

  const editTransaction = (id: string, t: Partial<Transaction>) =>
    setTransactions(prev => prev.map(tx => (tx.id === id ? { ...tx, ...t } : tx)));

  const deleteTransaction = (id: string) =>
    setTransactions(prev => prev.filter(tx => tx.id !== id));

  const addBudget = (b: Omit<Budget, 'id'>) =>
    setBudgets(prev => [...prev, { ...b, id: genId() }]);

  const editBudget = (id: string, b: Partial<Budget>) =>
    setBudgets(prev => prev.map(bud => (bud.id === id ? { ...bud, ...b } : bud)));

  const deleteBudget = (id: string) =>
    setBudgets(prev => prev.filter(b => b.id !== id));

  const addMessage = (m: Omit<ChatMessage, 'id' | 'timestamp'>) =>
    setChatHistory(prev => [
      ...prev,
      { ...m, id: genId(), timestamp: new Date().toISOString() },
    ]);

  const clearHistory = () => setChatHistory([]);

  const updateProfile = (p: Partial<UserProfile>) =>
    setProfile(prev => ({ ...prev, ...p }));

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setChatHistory([]);
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        chatHistory,
        profile,
        isLoaded,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addBudget,
        editBudget,
        deleteBudget,
        addMessage,
        clearHistory,
        updateProfile,
        clearAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
