import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Empregos',
  description: 'Balcão de vagas municipal. Encontre oportunidades de trabalho e candidate-se com seu perfil cidadão.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
