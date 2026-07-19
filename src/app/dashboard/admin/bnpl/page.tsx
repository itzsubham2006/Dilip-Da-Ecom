'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Eye, Snowflake, Thermometer, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { DataTable, SearchInput, StatusFilter, PageHeader, ConfirmDialog, ToastContainer, useToast } from '@/components/ui/data-table';
import { getAdminCreditAccounts, getAdminCreditAccountById, getCreditTransactions, increaseCreditLimit, reduceCreditLimit, freezeCredit, unfreezeCredit } from '@/features/admin/actions';
import type { CreditAccountAdmin } from '@/features/admin/types';

export default function AdminBNPLPage() {
  const [accounts, setAccounts] = useState<CreditAccountAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CreditAccountAdmin | null>(null);
  const [transactions, setTransactions] = useState<Array<Record<string, unknown>>>([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [limitModal, setLimitModal] = useState<{ id: string; action: 'increase' | 'reduce'; current: number } | null>(null);
  const [limitValue, setLimitValue] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const fetchAccounts = useCallback(async (p?: number) => {
    setLoading(true);
    const res = await getAdminCreditAccounts({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      page: p ?? page,
      pageSize: 20,
      sortBy,
      sortOrder,
    });
    if (res.success && res.data) {
      setAccounts(res.data.data as CreditAccountAdmin[]);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    }
    setLoading(false);
  }, [search, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchAccounts(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const viewAccount = async (id: string) => {
    const res = await getAdminCreditAccountById(id);
    if (res.success && res.data) {
      setSelectedAccount(res.data as CreditAccountAdmin);
      loadTransactions(id);
    }
  };

  const loadTransactions = async (accountId: string, p = 1) => {
    const res = await getCreditTransactions(accountId, p, 20);
    if (res.success && res.data) {
      setTransactions(res.data.data as Array<Record<string, unknown>>);
      setTxTotal(res.data.total);
      setTxPage(res.data.page);
    }
  };

  const handleLimitChange = async () => {
    if (!limitModal || !limitValue) return;
    const newLimit = parseFloat(limitValue);
    if (isNaN(newLimit) || newLimit <= 0) { addToast('Invalid limit', 'error'); return; }
    const res = limitModal.action === 'increase'
      ? await increaseCreditLimit(limitModal.id, newLimit, reasonValue || 'Admin adjustment')
      : await reduceCreditLimit(limitModal.id, newLimit, reasonValue || 'Admin adjustment');
    if (res.success) { addToast('Credit limit updated', 'success'); setLimitModal(null); setLimitValue(''); setReasonValue(''); fetchAccounts(); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleFreeze = async (id: string) => {
    const res = await freezeCredit(id, reasonValue || 'Frozen by admin');
    if (res.success) { addToast('Account frozen', 'success'); fetchAccounts(); if (selectedAccount?.id === id) setSelectedAccount(null); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const handleUnfreeze = async (id: string) => {
    const res = await unfreezeCredit(id, reasonValue || 'Unfrozen by admin');
    if (res.success) { addToast('Account unfrozen', 'success'); fetchAccounts(); if (selectedAccount?.id === id) setSelectedAccount(null); }
    else addToast(res.error ?? 'Failed', 'error');
  };

  const columns = [
    { key: 'user', header: 'User', render: (a: CreditAccountAdmin) => (
      <div>
        <p className="text-sm font-medium text-gray-700">{a.user?.full_name ?? 'Unknown'}</p>
        <p className="text-xs text-gray-500">{a.user?.email ?? ''}</p>
      </div>
    )},
    { key: 'limit', header: 'Limit', render: (a: CreditAccountAdmin) => (
      <span className="font-medium text-gray-900">₹{Number(a.credit_limit).toLocaleString('en-IN')}</span>
    )},
    { key: 'available', header: 'Available', render: (a: CreditAccountAdmin) => (
      <span className="font-medium text-emerald-600">₹{Number(a.available_credit).toLocaleString('en-IN')}</span>
    )},
    { key: 'outstanding', header: 'Outstanding', render: (a: CreditAccountAdmin) => (
      <span className={`font-medium ${a.outstanding > 0 ? 'text-red-600' : 'text-gray-600'}`}>₹{Number(a.outstanding).toLocaleString('en-IN')}</span>
    )},
    { key: 'utilization', header: 'Utilization', render: (a: CreditAccountAdmin) => {
      const pct = a.credit_limit > 0 ? Math.round((a.outstanding / a.credit_limit) * 100) : 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-gray-500">{pct}%</span>
        </div>
      );
    }, hideOnMobile: true},
    { key: 'status', header: 'Status', render: (a: CreditAccountAdmin) => {
      const colors: Record<string, string> = {
        active: 'bg-emerald-50 text-emerald-700', frozen: 'bg-blue-50 text-blue-700',
        suspended: 'bg-red-50 text-red-700', closed: 'bg-gray-50 text-gray-700',
      };
      return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[a.status] ?? 'bg-gray-50 text-gray-700'}`}>{a.status}</span>;
    }},
    { key: 'verification', header: 'Verification', render: (a: CreditAccountAdmin) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        a.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}>{a.verification_status}</span>
    ), hideOnMobile: true},
    { key: 'actions', header: 'Actions', render: (a: CreditAccountAdmin) => (
      <div className="flex items-center gap-1">
        <button onClick={() => viewAccount(a.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors" title="View details">
          <Eye size={14} />
        </button>
        <button onClick={() => setLimitModal({ id: a.id, action: 'increase', current: a.credit_limit })} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Increase limit">
          <ArrowUpCircle size={14} />
        </button>
        <button onClick={() => setLimitModal({ id: a.id, action: 'reduce', current: a.credit_limit })} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Reduce limit">
          <ArrowDownCircle size={14} />
        </button>
        {a.status === 'active' ? (
          <button onClick={() => { setConfirmAction({ type: 'freeze', id: a.id }); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="Freeze">
            <Snowflake size={14} />
          </button>
        ) : a.status === 'frozen' ? (
          <button onClick={() => { setConfirmAction({ type: 'unfreeze', id: a.id }); }} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Unfreeze">
            <Thermometer size={14} />
          </button>
        ) : null}
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="BNPL Administration" description={`${total} credit account${total !== 1 ? 's' : ''}`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by user name or email..." />
        </div>
        <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Frozen', value: 'frozen' },
          { label: 'Suspended', value: 'suspended' },
        ]} />
        <button onClick={() => fetchAccounts()} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={accounts as unknown as Record<string, unknown>[]}
          total={total}
          page={page}
          pageSize={20}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(p) => fetchAccounts(p)}
          onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          keyExtractor={(a) => (a as unknown as CreditAccountAdmin).id}
          emptyMessage="No credit accounts found"
        />
      </div>

      {/* Account detail modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setSelectedAccount(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Credit Account</h3>
                <p className="text-sm text-gray-500">{selectedAccount.user?.full_name} ({selectedAccount.user?.email})</p>
              </div>
              <button onClick={() => setSelectedAccount(null)} className="p-1 hover:bg-gray-100 rounded-lg">&times;</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Limit</p>
                <p className="text-lg font-bold text-gray-900">₹{Number(selectedAccount.credit_limit).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Available</p>
                <p className="text-lg font-bold text-emerald-600">₹{Number(selectedAccount.available_credit).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Outstanding</p>
                <p className="text-lg font-bold text-red-600">₹{Number(selectedAccount.outstanding).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{selectedAccount.status}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Interest Rate</span><span>{selectedAccount.interest_rate}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Late Fee Rate</span><span>{selectedAccount.late_fee_rate}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Due Days</span><span>{selectedAccount.due_days} days</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Verification</span><span>{selectedAccount.verification_status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Activated</span><span>{selectedAccount.activated_at ? new Date(selectedAccount.activated_at).toLocaleDateString() : 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Last Repayment</span><span>{selectedAccount.last_repayment_at ? new Date(selectedAccount.last_repayment_at).toLocaleDateString() : 'Never'}</span></div>
            </div>

            <div className="flex gap-2 mb-6">
              {selectedAccount.status === 'active' ? (
                <button onClick={() => handleFreeze(selectedAccount.id)} className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">Freeze</button>
              ) : selectedAccount.status === 'frozen' ? (
                <button onClick={() => handleUnfreeze(selectedAccount.id)} className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Unfreeze</button>
              ) : null}
            </div>

            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {transactions.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No transactions</p>
              ) : transactions.map((tx: Record<string, unknown>) => (
                <div key={tx.id as string} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-700 capitalize">{(tx.type as string).replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.created_at as string).toLocaleString()}</p>
                  </div>
                  <span className={`font-medium text-sm ${(tx.amount as number) > 0 && tx.type === 'repayment' ? 'text-emerald-600' : (tx.amount as number) > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {(tx.type as string) === 'repayment' ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            {txTotal > 20 && (
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => loadTransactions(selectedAccount.id, txPage - 1)} disabled={txPage <= 1} className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30">Prev</button>
                <button onClick={() => loadTransactions(selectedAccount.id, txPage + 1)} disabled={txPage * 20 >= txTotal} className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30">Next</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Limit change modal */}
      {limitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setLimitModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 capitalize">{limitModal.action} Credit Limit</h3>
            <p className="text-sm text-gray-500 mt-1">Current limit: ₹{Number(limitModal.current).toLocaleString('en-IN')}</p>
            <input type="number" value={limitValue} onChange={(e) => setLimitValue(e.target.value)} placeholder="New credit limit" min="0"
              className="w-full mt-4 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred" />
            <input value={reasonValue} onChange={(e) => setReasonValue(e.target.value)} placeholder="Reason for change"
              className="w-full mt-3 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred" />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setLimitModal(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleLimitChange} disabled={!limitValue} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zred rounded-xl hover:bg-zred-dark transition-colors disabled:opacity-50">Update</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmAction?.type === 'freeze' || confirmAction?.type === 'unfreeze'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'freeze') handleFreeze(confirmAction.id);
          if (confirmAction.type === 'unfreeze') handleUnfreeze(confirmAction.id);
        }}
        title={confirmAction?.type === 'freeze' ? 'Freeze credit' : 'Unfreeze credit'}
        message={confirmAction?.type === 'freeze' ? 'This account will not be able to use BNPL.' : 'This account will regain BNPL access.'}
        variant="danger"
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
