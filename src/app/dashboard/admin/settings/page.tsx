'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Save, Loader2 } from 'lucide-react';
import { PageHeader, ToastContainer, useToast, LoadingSkeleton } from '@/components/ui/data-table';
import { getSystemSettings, updateSystemSetting } from '@/features/admin/actions';
import type { SystemSetting } from '@/features/admin/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const { toasts, addToast, removeToast } = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await getSystemSettings();
    if (res.success && res.data) {
      const data = res.data as SystemSetting[];
      setSettings(data);
      const values: Record<string, string> = {};
      data.forEach((s) => { values[s.key] = s.value; });
      setEditingValues(values);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (id: string, key: string) => {
    setSaving(id);
    const res = await updateSystemSetting(id, editingValues[key]);
    if (res.success) addToast(`${key} saved`, 'success');
    else addToast(res.error ?? 'Failed to save', 'error');
    setSaving(null);
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-6" />
        <LoadingSkeleton rows={6} cols={2} />
      </div>
    );
  }

  const grouped: Record<string, SystemSetting[]> = {};
  const groupMap: Record<string, string> = {
    late_fee: 'Late Fee',
    grace: 'Grace Period',
    max_credit: 'Credit Limits',
    min_credit: 'Credit Limits',
    student: 'Student Eligibility',
    merchant: 'Merchant',
    tax: 'Tax',
    platform: 'Platform',
    maintenance: 'Maintenance',
    order: 'Orders',
    inventory: 'Inventory',
    notify: 'Notifications',
  };

  settings.forEach((s) => {
    const prefix = s.key.split('_')[0];
    const group = groupMap[prefix] ?? 'Other';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(s);
  });

  return (
    <div>
      <PageHeader title="System Settings" description="Configure platform-wide settings">
        <button onClick={fetchSettings} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </PageHeader>

      <div className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">{group}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {items.map((setting) => (
                <div key={setting.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {setting.key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    {setting.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {setting.type === 'boolean' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newVal = editingValues[setting.key] === 'true' ? 'false' : 'true';
                            setEditingValues((prev) => ({ ...prev, [setting.key]: newVal }));
                            handleSave(setting.id, setting.key);
                          }}
                          className={`relative w-10 h-6 rounded-full transition-colors ${editingValues[setting.key] === 'true' ? 'bg-zred' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editingValues[setting.key] === 'true' ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="text-xs text-gray-500 w-8">{editingValues[setting.key] === 'true' ? 'On' : 'Off'}</span>
                      </div>
                    ) : setting.type === 'number' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editingValues[setting.key] ?? ''}
                          onChange={(e) => setEditingValues((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                          className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred text-right"
                        />
                        <button
                          onClick={() => handleSave(setting.id, setting.key)}
                          disabled={saving === setting.id}
                          className="p-1.5 hover:bg-zred/10 rounded-lg text-gray-400 hover:text-zred transition-colors"
                        >
                          {saving === setting.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingValues[setting.key] ?? ''}
                          onChange={(e) => setEditingValues((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                          className="w-48 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zred/20 focus:border-zred"
                        />
                        <button
                          onClick={() => handleSave(setting.id, setting.key)}
                          disabled={saving === setting.id}
                          className="p-1.5 hover:bg-zred/10 rounded-lg text-gray-400 hover:text-zred transition-colors"
                        >
                          {saving === setting.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
