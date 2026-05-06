import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Obras Públicas',
  description: 'Acompanhe obras públicas, cronogramas e licitações em Santa Maria do Pará.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
