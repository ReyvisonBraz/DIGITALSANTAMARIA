export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-border rounded-full" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-border rounded-lg" />
            <div className="h-4 w-32 bg-border rounded-lg" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
