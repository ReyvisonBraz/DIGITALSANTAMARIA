import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Meu Perfil',
  description: 'Gerencie seu perfil cidadão, histórico de atividades, documentos digitais e preferências.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
