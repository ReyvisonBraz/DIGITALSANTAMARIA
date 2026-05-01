import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <Skeleton variant="line" className="h-8 w-48" />
      <Skeleton variant="line" className="h-4 w-72" />
      <Skeleton variant="card" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
      <Skeleton variant="card" />
    </div>
  );
}
