
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Wallet {
  id: string;
  wallet_id: string;
  balance: number;
  is_locked: boolean;
}

interface Transaction {
  id: string;
  transaction_ref: string;
  amount: number;
  transaction_type: string;
  status: string;
  description: string;
  created_at: string;
  from_user_id?: string;
  to_user_id?: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        return;
      }

      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    amount: number,
    type: string,
    description: string,
    toUserId?: string
  ) => {
    if (!user || !wallet) return { error: 'User or wallet not found' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          amount,
          transaction_type: type,
          description,
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        return { error: error.message };
      }

      // Update wallet balance for topup
      if (type === 'topup') {
        const newBalance = wallet.balance + amount;
        await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('id', wallet.id);
        
        setWallet({ ...wallet, balance: newBalance });
      }

      fetchTransactions();
      return { data };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { error: 'Failed to create transaction' };
    }
  };

  return {
    wallet,
    transactions,
    loading,
    createTransaction,
    refreshWallet: fetchWallet,
    refreshTransactions: fetchTransactions
  };
};
