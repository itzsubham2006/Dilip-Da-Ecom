export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 w-48 bg-zsurface rounded mb-2" />
      <div className="h-4 w-64 bg-zsurface rounded mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zcard rounded-xl shadow-z p-5">
            <div className="h-3 w-20 bg-zsurface rounded mb-3" />
            <div className="h-8 w-16 bg-zsurface rounded mb-2" />
            <div className="h-3 w-24 bg-zsurface rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
