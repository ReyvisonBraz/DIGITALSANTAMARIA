export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-10 w-40 bg-border rounded-xl" />
        <div className="h-4 w-56 bg-border rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white rounded-full border border-border" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
