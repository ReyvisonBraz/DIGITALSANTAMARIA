export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-border rounded-xl" />
        <div className="h-4 w-72 bg-border rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
