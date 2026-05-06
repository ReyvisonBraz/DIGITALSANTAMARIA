import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Saúde Digital',
  description: 'Agende consultas, visualize tempos de espera em UPAs, acesse sua carteira de vacinação digital e encontre unidades de saúde em Santa Maria do Pará.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
