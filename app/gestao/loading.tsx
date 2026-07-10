export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 w-40 bg-border rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-20 bg-white rounded-full border border-border" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-border" />
      </div>
    </div>
  );
}
