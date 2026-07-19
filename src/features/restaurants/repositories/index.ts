import { createServerSupabaseClient } from '@/infrastructure/supabase/server';
import type { Restaurant, RestaurantSettings, MerchantDashboard, RevenueOverview } from '../types';

export class RestaurantRepository {
  async findByOwnerId(ownerId: string): Promise<Restaurant | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('deleted_at', null)
      .maybeSingle();
    return data;
  }

  async findById(id: string): Promise<Restaurant | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .eq('deleted_at', null)
      .maybeSingle();
    return data;
  }

  async getSettings(restaurantId: string): Promise<RestaurantSettings | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .maybeSingle();
    return data;
  }

  async updateSettings(restaurantId: string, updates: Partial<RestaurantSettings>): Promise<RestaurantSettings | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('restaurant_settings')
      .update(updates)
      .eq('restaurant_id', restaurantId)
      .select()
      .single();
    return data;
  }

  async getDashboard(restaurantId: string): Promise<MerchantDashboard | null> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.rpc('get_merchant_dashboard', { p_restaurant_id: restaurantId });
    return data as MerchantDashboard | null;
  }

  async getRevenueOverview(restaurantId: string, days = 30): Promise<RevenueOverview> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { daily: [], weekly: [], monthly: [] };
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data: orders } = await supabase
      .from('orders')
      .select('created_at, total, status')
      .eq('restaurant_id', restaurantId)
      .in('status', ['completed', 'delivered'])
      .gte('created_at', since)
      .order('created_at', { ascending: true });
    if (!orders) return { daily: [], weekly: [], monthly: [] };
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    const weeklyMap = new Map<string, { revenue: number; orders: number }>();
    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    for (const o of orders) {
      const d = new Date(o.created_at);
      const day = d.toISOString().slice(0, 10);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const week = weekStart.toISOString().slice(0, 10);
      const month = d.toISOString().slice(0, 7);
      const r = o.total ?? 0;
      dailyMap.set(day, dailyMap.get(day) ?? { revenue: 0, orders: 0 });
      dailyMap.get(day)!.revenue += r;
      dailyMap.get(day)!.orders += 1;
      weeklyMap.set(week, weeklyMap.get(week) ?? { revenue: 0, orders: 0 });
      weeklyMap.get(week)!.revenue += r;
      weeklyMap.get(week)!.orders += 1;
      monthlyMap.set(month, monthlyMap.get(month) ?? { revenue: 0, orders: 0 });
      monthlyMap.get(month)!.revenue += r;
      monthlyMap.get(month)!.orders += 1;
    }
    return {
      daily: Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v })),
      weekly: Array.from(weeklyMap.entries()).map(([week, v]) => ({ week, ...v })),
      monthly: Array.from(monthlyMap.entries()).map(([month, v]) => ({ month, ...v })),
    };
  }
}

export const restaurantRepository = new RestaurantRepository();
