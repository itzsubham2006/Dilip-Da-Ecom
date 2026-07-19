'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp, DollarSign,
  Package, AlertTriangle, BarChart3, ArrowRight, UtensilsCrossed,
  RefreshCw,
} from 'lucide-react';
import { StatCard, Skeleton, DashboardCard, EmptyState } from '@/components/ui';
import { getMerchantDashboard, getMerchantRestaurant, toggleRestaurantOpen } from '@/features/restaurants/actions';

interface DashboardData {
  today_orders: number;
  pending_orders: number;
  preparing_orders: number;
  ready_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  today_revenue: number;
  weekly_revenue: number;
  monthly_revenue: number;
  average_order_value: number;
  active_products: number;
  low_stock_items: number;
  popular_products: Array<{ id: string; name: string; count: number; revenue: number }>;
  recent_activity: Array<{ id: string; type: string; message: string; created_at: string }>;
}

export default function MerchantDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [restaurant, setRestaurant] = useState<{ id: string; name: string; slug: string; is_open: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const [dashRes, restRes] = await Promise.all([getMerchantDashboard(), getMerchantRestaurant()]);
      if (!mounted) return;
      if (dashRes.success && dashRes.data) setData(dashRes.data);
      if (restRes.success && restRes.data) setRestaurant(restRes.data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    const [dashRes, restRes] = await Promise.all([getMerchantDashboard(), getMerchantRestaurant()]);
    if (dashRes.success && dashRes.data) setData(dashRes.data);
    if (restRes.success && restRes.data) setRestaurant(restRes.data);
    setLoading(false);
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    const res = await toggleRestaurantOpen();
    if (res.success && res.data) {
      const isOpen = res.data.is_open;
      setRestaurant((prev) => prev ? { ...prev, is_open: isOpen } : prev);
    }
    setToggling(false);
  };

  if (loading && !data) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data yet"
        description="Start accepting orders to see your dashboard."
        action={<button onClick={handleRefresh} className="inline-flex items-center gap-1.5 px-4 py-2 bg-zred text-white text-sm font-medium rounded-xl hover:bg-zred-dark transition-colors"><RefreshCw size={15} /> Refresh</button>}
      />
    );
  }

  const stats = [
    { label: "Today's Orders", value: String(data.today_orders), icon: ShoppingBag, color: '#E23744' },
    { label: 'Pending', value: String(data.pending_orders), icon: Clock, color: '#f59e0b' },
    { label: 'Preparing', value: String(data.preparing_orders), icon: Package, color: '#6366f1' },
    { label: 'Ready', value: String(data.ready_orders), icon: CheckCircle, color: '#10b981' },
    { label: 'Completed', value: String(data.completed_orders), icon: CheckCircle, color: '#059669' },
    { label: 'Cancelled', value: String(data.cancelled_orders), icon: XCircle, color: '#ef4444' },
    { label: "Today's Revenue", value: `₹${data.today_revenue}`, icon: DollarSign, color: '#E23744' },
    { label: 'Weekly Revenue', value: `₹${data.weekly_revenue}`, icon: TrendingUp, color: '#10b981' },
    { label: 'Monthly Revenue', value: `₹${data.monthly_revenue}`, icon: TrendingUp, color: '#6366f1' },
    { label: 'Avg Order Value', value: `₹${data.average_order_value}`, icon: DollarSign, color: '#8b5cf6' },
    { label: 'Active Products', value: String(data.active_products), icon: UtensilsCrossed, color: '#f97316' },
    { label: 'Low Stock Items', value: String(data.low_stock_items), icon: AlertTriangle, color: data.low_stock_items > 0 ? '#ef4444' : '#10b981' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          {restaurant && <p className="text-sm text-gray-500 mt-0.5">{restaurant.name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleToggle} disabled={toggling}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              restaurant?.is_open ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            <span className={`w-2 h-2 rounded-full ${restaurant?.is_open ? 'bg-green-500' : 'bg-gray-400'}`} />
            {restaurant?.is_open ? 'Open' : 'Closed'}
          </button>
          <button onClick={handleRefresh} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Popular Products">
          {data.popular_products.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.popular_products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{p.name}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{p.count} orders</span>
                    <span className="font-medium text-gray-900">₹{p.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard title="Recent Activity">
          {data.recent_activity.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {data.recent_activity.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.type === 'order' ? '#E23744' : a.type === 'payment' ? '#10b981' : '#6366f1' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(a.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Link href="/dashboard/merchant/orders" className="inline-flex items-center gap-1.5 px-4 py-2 bg-zred text-white text-sm font-medium rounded-xl hover:bg-zred-dark transition-colors">
          <ShoppingBag size={16} /> View orders <ArrowRight size={14} />
        </Link>
        <Link href="/dashboard/merchant/products" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
          <UtensilsCrossed size={16} /> Manage products
        </Link>
        <Link href="/dashboard/merchant/analytics" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
          <BarChart3 size={16} /> Analytics
        </Link>
      </div>
    </div>
  );
}
