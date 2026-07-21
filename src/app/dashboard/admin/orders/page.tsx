'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Eye, XCircle, Clock } from 'lucide-react';
import { DataTable, SearchInput, StatusFilter, PageHeader, ConfirmDialog, ToastContainer, useToast } from '@/components/ui/data-table';
import { getAdminOrders, forceUpdateOrderStatus, cancelOrderByAdmin, getAdminOrderById } from '@/features/admin/actions';
import type { AdminOrder } from '@/features/admin/types';

const ORDER_STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'assigned', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; newStatus?: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [forceStatus, setForceStatus] = useState('');
  const [forceReason, setForceReason] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const fetchOrders = useCallback(async (p?: number) => {
    setLoading(true);
    const res = await getAdminOrders({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      page: p ?? page,
      pageSize: 20,
      sortBy,
      sortOrder,
    });
    if (res.success && res.data) {
      setOrders(res.data.data as AdminOrder[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setLoading(false);
  }, [search, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchOrders(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async (id: string, reason: string) => {
    const res = await cancelOrderByAdmin(id, reason);
    if (res.success) { addToast('Order cancelled', 'success'); fetchOrders(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleForceUpdate = async () => {
    if (!confirmAction || !forceStatus) return;
    const res = await forceUpdateOrderStatus(confirmAction.id, forceStatus, forceReason || 'Admin override');
    if (res.success) { addToast('Order status updated', 'success'); setConfirmAction(null); setForceStatus(''); setForceReason(''); fetchOrders(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const viewOrderDetails = async (id: string) => {
    const res = await getAdminOrderById(id);
    if (res.success && res.data) setSelectedOrder(res.data as AdminOrder);
  };

  const columns = [
    { key: 'tracking', header: 'Tracking', render: (o: AdminOrder) => (
      <span className="font-mono text-xs font-medium text-gray-900">{o.tracking_code}</span>
    )},
    { key: 'customer', header: 'Customer', render: (o: AdminOrder) => (
      <div>
        <p className="text-sm font-medium text-gray-700">{o.user?.full_name ?? o.customer_name ?? 'Guest'}</p>
        <p className="text-xs text-gray-500">{o.user?.email ?? o.customer_email ?? ''}</p>
      </div>
    )},
    { key: 'restaurant', header: 'Restaurant', render: (o: AdminOrder) => (
      <span className="text-sm text-gray-600">{o.restaurant?.name ?? 'Unknown'}</span>
    ), hideOnMobile: true},
    { key: 'total', header: 'Total', sortable: true, render: (o: AdminOrder) => (
      <span className="font-medium text-gray-900">₹{Number(o.total).toLocaleString('en-IN')}</span>
    )},
    { key: 'payment', header: 'Payment', render: (o: AdminOrder) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-gray-500 capitalize">{o.payment_method ?? 'N/A'}</span>
        <span className={`text-[10px] font-medium ${o.payment_status === 'confirmed' ? 'text-emerald-600' : o.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
          {o.payment_status}
        </span>
      </div>
    ), hideOnMobile: true},
    { key: 'status', header: 'Status', render: (o: AdminOrder) => {
      const colors: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700', accepted: 'bg-blue-50 text-blue-700',
        preparing: 'bg-indigo-50 text-indigo-700', ready: 'bg-green-50 text-green-700',
        assigned: 'bg-purple-50 text-purple-700', out_for_delivery: 'bg-orange-50 text-orange-700',
        delivered: 'bg-emerald-50 text-emerald-700', completed: 'bg-emerald-50 text-emerald-700',
        cancelled: 'bg-red-50 text-red-700',
      };
      return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[o.status] ?? 'bg-gray-50 text-gray-700'}`}>{o.status.replace(/_/g, ' ')}</span>;
    }},
    { key: 'date', header: 'Date', sortable: true, render: (o: AdminOrder) => (
      <span className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</span>
    ), hideOnMobile: true},
    { key: 'actions', header: 'Actions', render: (o: AdminOrder) => (
      <div className="flex items-center gap-1">
        <button onClick={() => viewOrderDetails(o.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors" title="View details">
          <Eye size={14} />
        </button>
        {o.status !== 'cancelled' && o.status !== 'completed' && o.status !== 'delivered' && (
          <>
            <button onClick={() => setConfirmAction({ type: 'force', id: o.id })} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="Force update">
              <Clock size={14} />
            </button>
            <button onClick={() => setConfirmAction({ type: 'cancel', id: o.id })} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Cancel order">
              <XCircle size={14} />
            </button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Orders" description={`${total} total order${total !== 1 ? 's' : ''}`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by tracking code, customer..." />
        </div>
        <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
          { label: 'All status', value: 'all' },
          ...ORDER_STATUSES.map((s) => ({ label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: s })),
        ]} />
        <button onClick={() => fetchOrders()} aria-label="Refresh orders" className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={orders as unknown as Record<string, unknown>[]}
          total={total}
          page={page}
          pageSize={20}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(p) => fetchOrders(p)}
          onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          keyExtractor={(o) => (o as unknown as AdminOrder).id}
          emptyMessage="No orders found"
        />
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} aria-label="Close details" className="p-1 hover:bg-gray-100 rounded-lg">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tracking</span><span className="font-mono font-medium">{selectedOrder.tracking_code}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Customer</span><span>{selectedOrder.user?.full_name ?? selectedOrder.customer_name ?? 'Guest'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Restaurant</span><span>{selectedOrder.restaurant?.name ?? 'Unknown'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold">₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{selectedOrder.payment_method} ({selectedOrder.payment_status})</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{selectedOrder.status.replace(/_/g, ' ')}</span></div>
              {selectedOrder.cancellation_reason && (
                <div className="flex justify-between"><span className="text-gray-500">Cancel reason</span><span className="text-red-600">{selectedOrder.cancellation_reason}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Created</span><span>{new Date(selectedOrder.created_at).toLocaleString()}</span></div>
              {selectedOrder.delivery_address && (
                <div className="pt-3 border-t"><span className="text-gray-500 text-xs">Delivery Address</span>
                  <p className="text-gray-700 mt-1">{JSON.stringify(selectedOrder.delivery_address)}</p>
                </div>
              )}
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="pt-3 border-t">
                  <span className="text-gray-500 text-xs">Items</span>
                  <div className="mt-2 space-y-1">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-medium">₹{item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Force update modal */}
      {confirmAction?.type === 'force' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">Force Update Status</h3>
            <p className="text-sm text-gray-500 mt-1">This will be audited.</p>
            <select value={forceStatus} onChange={(e) => setForceStatus(e.target.value)} className="w-full mt-4 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20">
              <option value="">Select status...</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <input value={forceReason} onChange={(e) => setForceReason(e.target.value)} placeholder="Reason for change" className="w-full mt-3 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20" />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleForceUpdate} disabled={!forceStatus} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zred rounded-xl hover:bg-zred-dark transition-colors disabled:opacity-50">Update</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmAction?.type === 'cancel'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          handleCancel(confirmAction.id, 'Cancelled by admin');
        }}
        title="Cancel order"
        message="This will cancel the order. Are you sure?"
        variant="danger"
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
