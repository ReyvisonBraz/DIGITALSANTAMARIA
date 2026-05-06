import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Votações',
  description: 'Orçamento participativo, consultas públicas e votações de leis municipais.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
