import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeInteractive from '@/components/HomeInteractive';
import Skeleton from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Conecta Santa Maria | Santa Maria do Pará - PA',
  description:
    'Conecta Santa Maria — o portal do cidadão de Santa Maria do Pará. Solicite serviços, acompanhe protocolos e participe das decisões da cidade.',
};

function HomeSkeleton() {
  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel grid grid-cols-1 gap-8 p-5 sm:p-7 md:grid-cols-[1.08fr_0.92fr] md:p-9 lg:p-12">
          <div className="flex flex-col justify-center gap-7">
            <Skeleton className="h-6 w-40 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-2/3" />
            </div>
            <Skeleton className="h-5 w-full max-w-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-44 rounded-2xl" />
              <Skeleton className="h-12 w-44 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeInteractive />
    </Suspense>
  );
}
