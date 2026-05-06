import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Relatar Problema',
  description: 'Registre problemas urbanos com foto e geolocalização. Acompanhe o status em tempo real.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
