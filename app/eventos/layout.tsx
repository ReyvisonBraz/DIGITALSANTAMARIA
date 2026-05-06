import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Agenda cultural e eventos municipais. Shows, feiras, oficinas e muito mais.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
