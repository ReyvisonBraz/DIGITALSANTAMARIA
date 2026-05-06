import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Serviços',
  description: 'Catálogo completo de serviços públicos municipais com busca inteligente.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
