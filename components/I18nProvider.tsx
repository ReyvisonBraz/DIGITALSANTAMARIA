'use client';

import { NextIntlClientProvider } from 'next-intl';
import ptMessages from '@/messages/pt.json';

const locale = 'pt';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={ptMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
