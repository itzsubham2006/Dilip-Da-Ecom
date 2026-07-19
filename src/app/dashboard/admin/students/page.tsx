'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Shield, ShieldOff, CheckCircle, Clock } from 'lucide-react';
import { DataTable, SearchInput, StatusFilter, PageHeader, ConfirmDialog, ToastContainer, useToast } from '@/components/ui/data-table';
import { getAdminStudents, suspendStudent, unsuspendStudent, verifyStudent, resetStudentVerification, bulkSuspendStudents, bulkUnsuspendStudents } from '@/features/admin/actions';
import type { AdminStudent } from '@/features/admin/types';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id?: string; ids?: string[] } | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchStudents = useCallback(async (p?: number) => {
    setLoading(true);
    const res = await getAdminStudents({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      page: p ?? page,
      pageSize: 20,
      sortBy,
      sortOrder,
    });
    if (res.success && res.data) {
      setStudents(res.data.data as AdminStudent[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setLoading(false);
  }, [search, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchStudents(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSuspend = async (id: string) => {
    const res = await suspendStudent(id, 'Suspended by admin');
    if (res.success) { addToast('Student suspended', 'success'); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleUnsuspend = async (id: string) => {
    const res = await unsuspendStudent(id, 'Restored by admin');
    if (res.success) { addToast('Student restored', 'success'); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleVerify = async (id: string) => {
    const res = await verifyStudent(id);
    if (res.success) { addToast('Student verified', 'success'); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleResetVerification = async (id: string) => {
    const res = await resetStudentVerification(id, 'Reset by admin');
    if (res.success) { addToast('Verification reset', 'success'); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleBulkSuspend = async () => {
    const res = await bulkSuspendStudents(selectedIds, 'Bulk suspended by admin');
    if (res.success) { addToast(`Suspended ${res.count} students`, 'success'); setSelectedIds([]); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleBulkUnsuspend = async () => {
    const res = await bulkUnsuspendStudents(selectedIds, 'Bulk restored by admin');
    if (res.success) { addToast(`Restored ${res.count} students`, 'success'); setSelectedIds([]); fetchStudents(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const columns = [
    { key: 'name', header: 'Name', sortable: true, render: (s: AdminStudent) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
          {s.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{s.full_name}</p>
          <p className="text-xs text-gray-500">{s.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', header: 'Phone', render: (s: AdminStudent) => (
      <span className="text-gray-600">{s.phone ?? '-'}</span>
    ), hideOnMobile: true },
    { key: 'status', header: 'Status', render: (s: AdminStudent) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        s.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
        {s.is_active ? 'Active' : 'Suspended'}
      </span>
    )},
    { key: 'credit', header: 'Credit', render: (s: AdminStudent) => (
      <span className="text-xs text-gray-600">
        {s.credit_account ? `₹${Number(s.credit_account.credit_limit).toLocaleString('en-IN')}` : 'No account'}
      </span>
    ), hideOnMobile: true },
    { key: 'verification', header: 'Verification', render: (s: AdminStudent) => {
      const v = s.credit_account?.verification_status;
      const color = v === 'verified' ? 'text-emerald-700 bg-emerald-50' : v === 'pending' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50';
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
          {v ?? 'N/A'}
        </span>
      );
    }, hideOnMobile: true },
    { key: 'created', header: 'Joined', sortable: true, render: (s: AdminStudent) => (
      <span className="text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString()}</span>
    ), hideOnMobile: true },
    { key: 'actions', header: 'Actions', render: (s: AdminStudent) => (
      <div className="flex items-center gap-1">
        {s.is_active ? (
          <button onClick={() => setConfirmAction({ type: 'suspend', id: s.id })} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Suspend">
            <ShieldOff size={14} />
          </button>
        ) : (
          <button onClick={() => setConfirmAction({ type: 'unsuspend', id: s.id })} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Restore">
            <Shield size={14} />
          </button>
        )}
        {s.credit_account && s.credit_account.verification_status !== 'verified' && (
          <button onClick={() => handleVerify(s.id)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="Verify">
            <CheckCircle size={14} />
          </button>
        )}
        {s.credit_account && s.credit_account.verification_status === 'verified' && (
          <button onClick={() => setConfirmAction({ type: 'reset_verification', id: s.id })} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors" title="Reset verification">
            <Clock size={14} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Students" description={`${total} registered student${total !== 1 ? 's' : ''}`}>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{selectedIds.length} selected</span>
            <button onClick={() => setConfirmAction({ type: 'bulk_suspend', ids: selectedIds })} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              Suspend all
            </button>
            <button onClick={() => setConfirmAction({ type: 'bulk_unsuspend', ids: selectedIds })} className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
              Restore all
            </button>
          </div>
        )}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, email or phone..." />
        </div>
        <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
          { label: 'All status', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]} />
        <button onClick={() => fetchStudents()} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={students as unknown as Record<string, unknown>[]}
          total={total}
          page={page}
          pageSize={20}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(p) => fetchStudents(p)}
          onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          keyExtractor={(s) => (s as unknown as AdminStudent).id}
          emptyMessage="No students found"
          selectable
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'suspend' && confirmAction.id) handleSuspend(confirmAction.id);
          if (confirmAction.type === 'unsuspend' && confirmAction.id) handleUnsuspend(confirmAction.id);
          if (confirmAction.type === 'reset_verification' && confirmAction.id) handleResetVerification(confirmAction.id);
          if (confirmAction.type === 'bulk_suspend' && confirmAction.ids) handleBulkSuspend();
          if (confirmAction.type === 'bulk_unsuspend' && confirmAction.ids) handleBulkUnsuspend();
        }}
        title={
          confirmAction?.type === 'suspend' ? 'Suspend student' :
          confirmAction?.type === 'unsuspend' ? 'Restore student' :
          confirmAction?.type === 'reset_verification' ? 'Reset verification' :
          confirmAction?.type === 'bulk_suspend' ? 'Bulk suspend' :
          'Bulk restore'
        }
        message={
          confirmAction?.type === 'suspend' ? 'This student will lose access to their account.' :
          confirmAction?.type === 'unsuspend' ? 'This student will regain access.' :
          confirmAction?.type === 'reset_verification' ? 'The credit verification will be reset to pending.' :
          confirmAction?.type === 'bulk_suspend' ? `Suspend ${confirmAction?.ids?.length} students? They will lose access.` :
          `Restore ${confirmAction?.ids?.length} students?`
        }
        variant="danger"
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
