'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { DataTable, SearchInput, StatusFilter, PageHeader, ToastContainer, useToast } from '@/components/ui/data-table';
import { getAdminPayments, processRefund } from '@/features/admin/actions';
import type { PaymentAdmin } from '@/features/admin/types';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refundModal, setRefundModal] = useState<{ id: string; amount: number; currentRefunded: number } | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const fetchPayments = useCallback(async (p?: number) => {
    setLoading(true);
    const res = await getAdminPayments({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      page: p ?? page,
      pageSize: 20,
      sortBy,
      sortOrder,
    });
    if (res.success && res.data) {
      setPayments(res.data.data as PaymentAdmin[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setLoading(false);
  }, [search, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchPayments(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefund = async () => {
    if (!refundModal || !refundAmount || !refundReason) return;
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) { addToast('Invalid amount', 'error'); return; }
    if (amount > refundModal.amount - refundModal.currentRefunded) { addToast('Amount exceeds remaining refundable', 'error'); return; }
    const res = await processRefund(refundModal.id, amount, refundReason);
    if (res.success) { addToast('Refund processed', 'success'); setRefundModal(null); setRefundAmount(''); setRefundReason(''); fetchPayments(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const columns = [
    { key: 'id', header: 'Payment ID', render: (p: PaymentAdmin) => (
      <span className="font-mono text-xs text-ztext-light">{p.id.slice(0, 8)}...</span>
    )},
    { key: 'order', header: 'Order', render: (p: PaymentAdmin) => (
      <span className="font-mono text-xs font-medium text-ztext">{p.order?.tracking_code ?? 'N/A'}</span>
    )},
    { key: 'amount', header: 'Amount', sortable: true, render: (p: PaymentAdmin) => (
      <span className="font-medium text-ztext">₹{Number(p.amount).toLocaleString('en-IN')}</span>
    )},
    { key: 'method', header: 'Method', render: (p: PaymentAdmin) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-ztext-light capitalize">{p.payment_method}</span>
        <span className="text-[10px] text-ztext-muted">{p.gateway}</span>
      </div>
    ), hideOnMobile: true},
    { key: 'gateway', header: 'Gateway ID', render: (p: PaymentAdmin) => (
      <span className="font-mono text-[10px] text-ztext-lighter">{p.gateway_payment_id?.slice(0, 16) ?? '-'}</span>
    ), hideOnMobile: true},
    { key: 'status', header: 'Status', render: (p: PaymentAdmin) => {
      const colors: Record<string, string> = {
        pending: 'bg-amber-500/10 text-amber-400', confirmed: 'bg-emerald-500/10 text-emerald-400',
        failed: 'bg-red-500/10 text-red-400', refunded: 'bg-blue-500/10 text-blue-400',
        partially_refunded: 'bg-indigo-500/10 text-indigo-400',
      };
      return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[p.status] ?? 'bg-zgray text-ztext-light'}`}>{p.status.replace(/_/g, ' ')}</span>;
    }},
    { key: 'refunded', header: 'Refunded', render: (p: PaymentAdmin) => (
      <span className="text-xs text-ztext-lighter">₹{Number(p.refund_amount ?? 0).toLocaleString('en-IN')}</span>
    ), hideOnMobile: true},
    { key: 'date', header: 'Date', sortable: true, render: (p: PaymentAdmin) => (
      <span className="text-xs text-ztext-lighter">{new Date(p.created_at).toLocaleString()}</span>
    ), hideOnMobile: true},
    { key: 'actions', header: 'Actions', render: (p: PaymentAdmin) => (
      <div className="flex items-center gap-1">
        {p.status === 'confirmed' && (
          <button onClick={() => { setRefundModal({ id: p.id, amount: p.amount, currentRefunded: p.refund_amount ?? 0 }); setRefundAmount(''); }}
            className="p-1.5 hover:bg-blue-500/10 rounded-lg text-ztext-muted hover:text-blue-600 transition-colors" title="Refund">
            <Download size={14} />
          </button>
        )}
      </div>
    )},
  ];

  const handleExport = () => {
    const csv = [
      ['ID', 'Order', 'Amount', 'Method', 'Gateway', 'Gateway ID', 'Status', 'Refunded', 'Date'].join(','),
      ...payments.map((p) => [p.id, p.order?.tracking_code ?? '', p.amount, p.payment_method, p.gateway, p.gateway_payment_id ?? '', p.status, p.refund_amount ?? 0, p.created_at].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Payments" description={`${total} transaction${total !== 1 ? 's' : ''}`}>
        <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-zcard border border-zborder rounded-xl hover:bg-zgray transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by gateway ID or order..." />
        </div>
        <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
          { label: 'All', value: 'all' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Pending', value: 'pending' },
          { label: 'Failed', value: 'failed' },
          { label: 'Refunded', value: 'refunded' },
        ]} />
        <button onClick={() => fetchPayments()} aria-label="Refresh payments" className="p-2.5 rounded-xl hover:bg-zgray text-ztext-lighter transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-zcard rounded-xl border border-zborder">
        <DataTable
          columns={columns}
          data={payments as unknown as Record<string, unknown>[]}
          total={total}
          page={page}
          pageSize={20}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(p) => fetchPayments(p)}
          onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          keyExtractor={(p) => (p as unknown as PaymentAdmin).id}
          emptyMessage="No payments found"
        />
      </div>

      {refundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setRefundModal(null)}>
          <div className="bg-zcard rounded-2xl p-6 max-w-sm w-full shadow-z-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-ztext">Process Refund</h3>
            <p className="text-sm text-ztext-lighter mt-1">Max refundable: ₹{Number(refundModal.amount - refundModal.currentRefunded).toLocaleString('en-IN')}</p>
            <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="Refund amount" min="0" step="0.01"
              className="w-full mt-4 px-3 py-2.5 text-sm border border-zborder rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred" />
            <input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason for refund"
              className="w-full mt-3 px-3 py-2.5 text-sm border border-zborder rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred" />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setRefundModal(null)} className="flex-1 px-4 py-2 text-sm font-medium text-ztext-light bg-zgray rounded-xl hover:bg-zsurface transition-colors">Cancel</button>
              <button onClick={handleRefund} disabled={!refundAmount || !refundReason} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zred rounded-xl hover:bg-zred-dark transition-colors disabled:opacity-50">Refund</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
