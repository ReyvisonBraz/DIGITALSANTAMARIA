import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Segurança',
  description: 'Botão de pânico, mapa de ocorrências e alertas de segurança no seu bairro.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
