import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trânsito',
  description: 'Rotas de ônibus, multas, estacionamento e informações de mobilidade urbana.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
