import { createServerSupabaseClient } from '@/infrastructure/supabase/server';
import type { CreditTransaction } from '../types';

export class CreditTransactionRepository {
  async findByAccountId(accountId: string, limit = 20): Promise<CreditTransaction[]> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('credit_account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as CreditTransaction[];
  }

  async findByOrderId(orderId: string): Promise<CreditTransaction | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('order_id', orderId)
      .single();
    return data as CreditTransaction | null;
  }

  async findByUserId(userId: string, limit = 20): Promise<CreditTransaction[]> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from('credit_transactions')
      .select('*, credit_accounts!inner(user_id)')
      .eq('credit_accounts.user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as CreditTransaction[];
  }

  async create(tx: {
    creditAccountId: string;
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    orderId?: string;
    description?: string;
    reference?: string;
  }): Promise<CreditTransaction> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('No server client');
    const { data, error } = await supabase
      .from('credit_transactions')
      .insert({
        credit_account_id: tx.creditAccountId,
        type: tx.type,
        amount: tx.amount,
        balance_before: tx.balanceBefore,
        balance_after: tx.balanceAfter,
        order_id: tx.orderId || null,
        description: tx.description || null,
        reference: tx.reference || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as CreditTransaction;
  }
}

export const creditTransactionRepository = new CreditTransactionRepository();
