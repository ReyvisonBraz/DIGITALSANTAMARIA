import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Educação',
  description: 'Matrícula escolar online, consulta de notas e informações da rede municipal de ensino.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
