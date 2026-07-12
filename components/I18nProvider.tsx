'use client';

import { NextIntlClientProvider } from 'next-intl';
import ptMessages from '@/messages/pt.json';
import enMessages from '@/messages/en.json';

const messages: Record<string, typeof ptMessages> = {
  pt: ptMessages,
  en: enMessages,
};

const defaultLocale = 'pt';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = defaultLocale;

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
