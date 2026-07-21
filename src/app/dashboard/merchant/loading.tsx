import { StatGridSkeleton } from '@/components/shared/LoadingSkeleton';

export default function MerchantDashboardLoading() {
  return (
    <div className="p-6">
      <StatGridSkeleton count={12} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-zgray rounded-xl animate-pulse" />
        <div className="h-64 bg-zgray rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
