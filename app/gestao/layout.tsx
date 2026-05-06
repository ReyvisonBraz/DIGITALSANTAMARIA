import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Painel de Gestão',
  description: 'Painel administrativo para gestores municipais gerenciarem demandas da cidade.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
