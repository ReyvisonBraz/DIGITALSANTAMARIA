export default function Loading() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-10 w-40 bg-border rounded-xl" />
        <div className="h-4 w-64 bg-border rounded-lg" />
        <div className="space-y-4">
          <div className="h-12 bg-white rounded-xl border border-border" />
          <div className="h-32 bg-white rounded-2xl border border-border" />
          <div className="h-12 bg-white rounded-xl border border-border" />
        </div>
        <div className="h-14 bg-primary/20 rounded-[2rem] w-48" />
      </div>
    </div>
  );
}
