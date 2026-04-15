'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

const KNOWN_LOCALES = new Set(['en', 'ku']);

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

  const isKurdish = locale === 'ku';
  const nextLocale = isKurdish ? 'en' : 'ku';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isKurdish}
      aria-label={isKurdish ? 'Change dashboard language to English' : 'گۆڕینی زمانی داشبۆرد بۆ کوردی'}
      onClick={() => handleChangeLanguage(nextLocale)}
      disabled={isPending}
      className="group relative h-10 w-28 rounded-full border border-[#2f5536]/25 bg-gradient-to-r from-[#edf8ef] via-white to-[#f0f7f2] p-1 shadow-[0_4px_14px_rgba(47,85,54,0.15)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(47,85,54,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#386641]/55 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span
        className={`absolute inset-y-1 w-12 rounded-full bg-[#386641] shadow-md transition-all duration-300 ${
          isKurdish ? 'translate-x-[3.75rem]' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 grid h-full grid-cols-2 items-center text-xs font-extrabold tracking-wide">
        <span
          className={`text-center transition-colors duration-300 ${
            isKurdish ? 'text-[#2f5536]' : 'text-white'
          }`}
        >
          EN
        </span>
        <span
          className={`text-center transition-colors duration-300 ${
            isKurdish ? 'text-white' : 'text-[#2f5536]'
          }`}
        >
          KU
        </span>
      </span>
    </button>
  );
}
