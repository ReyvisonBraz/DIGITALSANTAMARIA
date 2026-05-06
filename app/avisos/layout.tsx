import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Avisos',
  description: 'Alertas oficiais, comunicados da prefeitura e notícias de utilidade pública.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
