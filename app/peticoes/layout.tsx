import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Petições',
  description: 'Crie e assine petições para melhorar Santa Maria do Pará. Mobilidade, saúde, lazer e mais.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
