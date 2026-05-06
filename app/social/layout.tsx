import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Social',
  description: 'Cadastro Único, CRAS, programas de habitação e assistência social municipal.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
