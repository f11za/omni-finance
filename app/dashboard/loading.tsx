export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-10">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="h-48 w-full bg-slate-200 rounded-3xl mb-10"></div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 h-[400px] bg-slate-200 rounded-2xl"></div>
        <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 h-16 bg-slate-50"></div>
        <div className="space-y-4 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-100 rounded"></div>
                <div className="h-3 w-20 bg-slate-100 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}