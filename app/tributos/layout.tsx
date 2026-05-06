import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Tributos',
  description: 'IPTU, certidões negativas, parcelamento e serviços da fazenda municipal.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
