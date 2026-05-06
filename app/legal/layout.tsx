import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Legal',
  description: 'Termos de uso, política de privacidade e informações legais da plataforma.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
