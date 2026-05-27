import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-primary/10">
        <SearchX className="h-9 w-9 text-primary" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md font-medium text-text-muted">
        A página que você procura não existe ou foi movida.
      </p>
      <Link href="/" className="action-button-primary mt-7">
        <Home className="h-4 w-4" />
        Voltar ao início
      </Link>
    </div>
  );
}
