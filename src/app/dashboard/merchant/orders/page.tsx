'use client';

import { useEffect, useState } from 'react';
import { Search, ShoppingBag, RefreshCw, Check, X, ChefHat, PackageCheck, Ban } from 'lucide-react';
import { getOrders, updateOrderStatus, getOrderCounts } from '@/features/orders/actions';
import type { Order, OrderStatus, OrdersFilter } from '@/features/orders/types';
import { canTransition } from '@/features/orders/types';
import { Skeleton, EmptyState, StatusBadge } from '@/components/ui';

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const actionsList: { label: string; status: OrderStatus; icon: React.ElementType; color: string }[] = [
  { label: 'Accept', status: 'accepted', icon: Check, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Preparing', status: 'preparing', icon: ChefHat, color: 'bg-indigo-500 hover:bg-indigo-600' },
  { label: 'Ready', status: 'ready', icon: PackageCheck, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { label: 'Complete', status: 'completed', icon: Check, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'Decline', status: 'declined', icon: X, color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Cancel', status: 'cancelled', icon: Ban, color: 'bg-red-600 hover:bg-red-700' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const filter: OrdersFilter = { status: currentTab, page, pageSize: 20, sortBy: 'created_at', sortOrder: 'desc' };
    if (search) filter.search = search;
    const [oRes, cRes] = await Promise.all([getOrders(filter), getOrderCounts()]);
    if (oRes.success && oRes.data) { setOrders(oRes.data.orders); setTotalPages(oRes.data.totalPages); }
    if (cRes.success && cRes.data) setCounts(cRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchOrders();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, page, search]);

  const handleAction = async (orderId: string, status: OrderStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if ((status === 'declined' || status === 'cancelled') && !prompt(`Reason for ${status}? (optional)`)) return;
    setActionLoading(orderId);
    await updateOrderStatus(orderId, status);
    setActionLoading(null);
    fetchOrders();
  };

  const tabCount = (tab: string) => {
    if (tab === 'all') return Object.values(counts).reduce((a, b) => a + b, 0);
    return counts[tab] ?? 0;
  };

  const getAvailableActions = (order: Order) => {
    return actionsList.filter((a) => canTransition(order.status, a.status));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
        <button onClick={fetchOrders} aria-label="Refresh orders" className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {statusTabs.map((tab) => (
          <button key={tab.value} onClick={() => { setCurrentTab(tab.value); setPage(1); }}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              currentTab === tab.value ? 'bg-zred text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {tab.label} {tabCount(tab.value) > 0 && <span className="ml-1.5 text-xs opacity-70">({tabCount(tab.value)})</span>}
          </button>
        ))}
      </div>

      <div className="relative max-w-xs mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tracking code..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred" />
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found" description={currentTab !== 'all' ? `No ${currentTab} orders.` : 'No orders yet.'} />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-gray-900">{order.tracking_code}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>₹{order.total}</span>
                    <span>{order.order_items?.length ?? 0} items</span>
                    <span>{order.payment_method?.toUpperCase() ?? 'N/A'}</span>
                    {order.customer_name && <span className="truncate">{order.customer_name}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {getAvailableActions(order).map((action) => (
                    <button key={action.status} onClick={(e) => handleAction(order.id, action.status, e)}
                      disabled={actionLoading === order.id}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${action.color}`}>
                      <action.icon size={12} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
              {order.delivery_notes && (
                <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">
                  Note: {order.delivery_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Previous</button>
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
