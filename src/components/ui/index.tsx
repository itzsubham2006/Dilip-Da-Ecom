export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function StatCard({ label, value, icon: Icon, trend, color }: {
  label: string; value: string; icon: React.ElementType; trend?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color ? `${color}15` : '#fee2e2' }}>
          <Icon size={17} style={{ color: color ?? '#E23744' }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </div>
  );
}

export function DashboardCard({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    accepted: 'bg-blue-50 text-blue-700 border-blue-200',
    preparing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    ready: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    declined: 'bg-red-50 text-red-700 border-red-200',
    assigned: 'bg-purple-50 text-purple-700 border-purple-200',
    out_for_delivery: 'bg-orange-50 text-orange-700 border-orange-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.ElementType; title: string; description: string; action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
