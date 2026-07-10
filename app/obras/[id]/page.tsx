import type { Metadata } from 'next';
import ObraDetalhesClient from './ObraDetalhesClient';

export const metadata: Metadata = {
  title: 'Detalhes da Obra',
  description: 'Acompanhe o progresso, orçamento e cronograma desta obra pública municipal.',
};

export default function ObraDetalhesPage() {
  return <ObraDetalhesClient />;
}
