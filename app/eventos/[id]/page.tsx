import type { Metadata } from 'next';
import EventoDetalhesClient from './EventoDetalhesClient';

export const metadata: Metadata = {
  title: 'Detalhes do Evento',
  description: 'Confira data, local, organizador e detalhes deste evento cultural de Santa Maria do Pará.',
};

export default function EventoDetalhesPage() {
  return <EventoDetalhesClient />;
}
