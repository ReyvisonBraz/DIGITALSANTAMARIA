import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Comércio Local',
  description: 'Vitrine de produtores locais, alvarás digitais e apoio ao MEI em Santa Maria do Pará.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
