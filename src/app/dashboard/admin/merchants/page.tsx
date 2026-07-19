'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw, Percent, Shield, ShieldOff } from 'lucide-react';
import { DataTable, SearchInput, StatusFilter, PageHeader, ConfirmDialog, ToastContainer, useToast } from '@/components/ui/data-table';
import { getAdminMerchants, approveMerchant, rejectMerchant, suspendMerchant, restoreMerchant, updateMerchantCommission, bulkSuspendMerchants, bulkRestoreMerchants } from '@/features/admin/actions';
import type { AdminMerchant } from '@/features/admin/types';

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<AdminMerchant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id?: string; ids?: string[]; restaurantId?: string } | null>(null);
  const [commissionModal, setCommissionModal] = useState<{ id: string; current: number } | null>(null);
  const [commissionValue, setCommissionValue] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const fetchMerchants = useCallback(async (p?: number) => {
    setLoading(true);
    const res = await getAdminMerchants({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      page: p ?? page,
      pageSize: 20,
      sortBy,
      sortOrder,
    });
    if (res.success && res.data) {
      setMerchants(res.data.data as AdminMerchant[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setLoading(false);
  }, [search, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchMerchants(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id: string, restaurantId: string) => {
    const res = await approveMerchant(id, restaurantId);
      if (res.success) { addToast('Merchant approved', 'success'); fetchMerchants(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleReject = async (id: string, restaurantId: string) => {
    const res = await rejectMerchant(id, restaurantId, 'Rejected by admin');
    if (res.success) { addToast('Merchant rejected', 'success'); fetchMerchants(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleSuspend = async (id: string) => {
    const res = await suspendMerchant(id, 'Suspended by admin');
    if (res.success) { addToast('Merchant suspended', 'success'); fetchMerchants(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleRestore = async (id: string) => {
    const res = await restoreMerchant(id, 'Restored by admin');
    if (res.success) { addToast('Merchant restored', 'success'); fetchMerchants(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleCommission = async () => {
    if (!commissionModal || !commissionValue) return;
    const rate = parseFloat(commissionValue);
    if (isNaN(rate) || rate < 0 || rate > 100) { addToast('Invalid commission rate (0-100)', 'error'); return; }
    const res = await updateMerchantCommission(commissionModal.id, rate);
    if (res.success) { addToast('Commission updated', 'success'); setCommissionModal(null); fetchMerchants(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const columns = [
    { key: 'name', header: 'Merchant', sortable: true, render: (m: AdminMerchant) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-xs font-bold text-orange-700">
          {m.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{m.full_name}</p>
          <p className="text-xs text-gray-500">{m.email}</p>
        </div>
      </div>
    )},
    { key: 'restaurant', header: 'Restaurant', render: (m: AdminMerchant) => (
      m.restaurant ? (
        <div>
          <p className="text-sm font-medium text-gray-700">{m.restaurant.name}</p>
          <p className="text-xs text-gray-500">{m.restaurant.city}</p>
        </div>
      ) : <span className="text-xs text-gray-400">No restaurant</span>
    )},
    { key: 'status', header: 'Status', render: (m: AdminMerchant) => {
      const s = m.restaurant?.status ?? 'inactive';
      const color = s === 'active' ? 'bg-emerald-50 text-emerald-700' : s === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
      return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>{s}</span>;
    }},
    { key: 'commission', header: 'Commission', render: (m: AdminMerchant) => (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{m.restaurant?.commission_rate ?? 0}%</span>
        <button onClick={() => { setCommissionModal({ id: m.id, current: m.restaurant?.commission_rate ?? 0 }); setCommissionValue(String(m.restaurant?.commission_rate ?? 0)); }}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
          <Percent size={12} />
        </button>
      </div>
    ), hideOnMobile: true },
    { key: 'open', header: 'Open', render: (m: AdminMerchant) => (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.restaurant?.is_open ? 'text-emerald-700' : 'text-gray-400'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${m.restaurant?.is_open ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        {m.restaurant?.is_open ? 'Open' : 'Closed'}
      </span>
    ), hideOnMobile: true },
    { key: 'created', header: 'Joined', sortable: true, render: (m: AdminMerchant) => (
      <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
    ), hideOnMobile: true },
    { key: 'actions', header: 'Actions', render: (m: AdminMerchant) => {
      const rest = m.restaurant;
      return (
      <div className="flex items-center gap-1">
        {rest?.status === 'pending' && (
          <>
            <button onClick={() => rest && setConfirmAction({ type: 'approve', id: m.id, restaurantId: rest.id })}
              className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Approve">
              <CheckCircle size={14} />
            </button>
            <button onClick={() => rest && setConfirmAction({ type: 'reject', id: m.id, restaurantId: rest.id })}
              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Reject">
              <XCircle size={14} />
            </button>
          </>
        )}
        {m.is_active ? (
          <button onClick={() => setConfirmAction({ type: 'suspend', id: m.id })} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Suspend">
            <ShieldOff size={14} />
          </button>
        ) : (
          <button onClick={() => setConfirmAction({ type: 'restore', id: m.id })} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Restore">
            <Shield size={14} />
          </button>
        )}
      </div>
      );
    }},
  ];

  return (
    <div>
      <PageHeader title="Merchants" description={`${total} registered merchant${total !== 1 ? 's' : ''}`}>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{selectedIds.length} selected</span>
            <button onClick={() => setConfirmAction({ type: 'bulk_suspend', ids: selectedIds })} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">Suspend</button>
            <button onClick={() => setConfirmAction({ type: 'bulk_restore', ids: selectedIds })} className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Restore</button>
          </div>
        )}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search merchants..." />
        </div>
        <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]} />
        <button onClick={() => fetchMerchants()} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={merchants as unknown as Record<string, unknown>[]}
          total={total}
          page={page}
          pageSize={20}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(p) => fetchMerchants(p)}
          onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          keyExtractor={(m) => (m as unknown as AdminMerchant).id}
          emptyMessage="No merchants found"
          selectable
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      {/* Commission modal */}
      {commissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setCommissionModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">Update Commission</h3>
            <p className="text-sm text-gray-500 mt-1">Enter commission rate (0-100%)</p>
            <input
              type="number"
              value={commissionValue}
              onChange={(e) => setCommissionValue(e.target.value)}
              min="0" max="100" step="0.5"
              className="w-full mt-4 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">Current: {commissionModal.current}%</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCommissionModal(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleCommission} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zred rounded-xl hover:bg-zred-dark transition-colors">Update</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'approve' && confirmAction.id && confirmAction.restaurantId) handleApprove(confirmAction.id, confirmAction.restaurantId);
          if (confirmAction.type === 'reject' && confirmAction.id && confirmAction.restaurantId) handleReject(confirmAction.id, confirmAction.restaurantId);
          if (confirmAction.type === 'suspend' && confirmAction.id) handleSuspend(confirmAction.id);
          if (confirmAction.type === 'restore' && confirmAction.id) handleRestore(confirmAction.id);
          if (confirmAction.type === 'bulk_suspend' && confirmAction.ids) { const ids = confirmAction.ids; setConfirmAction(null); bulkSuspendMerchants(ids, 'Bulk suspended').then((r) => { if (r.success) { addToast(`Suspended ${r.count} merchants`, 'success'); setSelectedIds([]); fetchMerchants(); }}); }
          if (confirmAction.type === 'bulk_restore' && confirmAction.ids) { const ids = confirmAction.ids; setConfirmAction(null); bulkRestoreMerchants(ids, 'Bulk restored').then((r) => { if (r.success) { addToast(`Restored ${r.count} merchants`, 'success'); setSelectedIds([]); fetchMerchants(); }}); }
        }}
        title={
          confirmAction?.type === 'approve' ? 'Approve merchant' :
          confirmAction?.type === 'reject' ? 'Reject merchant' :
          confirmAction?.type === 'suspend' ? 'Suspend merchant' :
          confirmAction?.type === 'restore' ? 'Restore merchant' : 'Bulk action'
        }
        message={
          confirmAction?.type === 'approve' ? 'This merchant will be approved and can start operating.' :
          confirmAction?.type === 'reject' ? 'This merchant application will be rejected.' :
          confirmAction?.type === 'suspend' ? 'This merchant will lose access to their account.' :
          confirmAction?.type === 'restore' ? 'This merchant will regain access.' :
          `Perform action on ${confirmAction?.ids?.length} merchants?`
        }
        variant="danger"
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
