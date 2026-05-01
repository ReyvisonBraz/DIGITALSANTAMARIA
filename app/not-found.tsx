import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Página não encontrada
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
      >
        <Home className="w-4 h-4" />
        Voltar ao início
      </Link>
    </div>
  );
}
