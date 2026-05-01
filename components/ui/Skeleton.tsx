import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'card' | 'avatar' | 'page';
}

export default function Skeleton({ className, variant = 'line' }: SkeletonProps) {
  const base = 'animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700';

  const variants: Record<string, string> = {
    line: 'h-4 w-full',
    card: 'h-32 w-full',
    avatar: 'h-12 w-12 rounded-full',
    page: 'h-96 w-full',
  };

  return <div className={cn(base, variants[variant], className)} />;
}
