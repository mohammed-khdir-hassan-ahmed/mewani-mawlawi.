'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

const KNOWN_LOCALES = new Set(['en', 'ku', 'ar']);
const LOCALE_ORDER = ['ku', 'en', 'ar'];

function getBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  while (segments.length > 0 && KNOWN_LOCALES.has(segments[0])) {
    segments.shift();
  }

  return segments.length ? `/${segments.join('/')}` : '/';
}

export default function DashboardLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChangeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      const basePath = getBasePath(pathname);
      router.replace(basePath, { locale: newLocale });
    });
  };

  const localeLabels: Record<string, string> = {
    'ku': 'KU',
    'en': 'EN',
    'ar': 'AR',
  };

  const nextLocale = LOCALE_ORDER[(LOCALE_ORDER.indexOf(locale) + 1) % LOCALE_ORDER.length];

  return (
    <button
      type="button"
      role="switch"
      aria-label={`Change dashboard language to ${localeLabels[nextLocale]}`}
      onClick={() => handleChangeLanguage(nextLocale)}
      disabled={isPending}
      className="h-10 px-4 rounded-full border border-[#2f5536]/25 bg-gradient-to-r from-[#edf8ef] via-white to-[#f0f7f2] shadow-[0_4px_14px_rgba(47,85,54,0.15)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(47,85,54,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#386641]/55 disabled:cursor-not-allowed disabled:opacity-70 text-xs font-extrabold tracking-wide text-[#386641]"
    >
      {localeLabels[locale]}
    </button>
  );
}
