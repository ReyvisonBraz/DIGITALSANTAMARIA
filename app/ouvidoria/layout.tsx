import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Ouvidoria',
  description: 'Manifeste-se sobre serviços públicos. Reclamações, sugestões, denúncias e elogios com protocolo oficial.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
