import type { Metadata } from 'next';
import PetitionDetailClient from './PetitionDetailClient';

export const metadata: Metadata = {
  title: 'Detalhes da Petição',
  description: 'Acompanhe o progresso, assinaturas e respostas oficiais desta petição cidadã.',
};

export default function PetitionDetailPage() {
  return <PetitionDetailClient />;
}
