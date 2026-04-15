'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Languages } from 'lucide-react';

const KNOWN_LOCALES = new Set(['en', 'ku']);

function getBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  while (segments.length > 0 && KNOWN_LOCALES.has(segments[0])) {
    segments.shift();
  }

  return segments.length ? `/${segments.join('/')}` : '/';
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      const basePath = getBasePath(pathname);
      router.replace(basePath, { locale: newLocale });
    });
  };


  const LANGUAGES = [
    { code: 'ku', label: 'کوردی' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-8 h-8 md:w-10 md:h-10 aspect-square bg-[#386641] text-white rounded-md flex flex-col items-center justify-center text-base font-bold shadow hover:bg-[#2a4d30] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#386641]/55"
        aria-label="Change language"
      >
        <Languages size={18} className="mb-0.5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs w-full p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#386641] text-center">
              {locale === 'ku' ? 'گۆڕینی زمان' : 'Change Language'}
            </DialogTitle>
            <DialogDescription className="text-center mb-4">
              {locale === 'ku' ? 'زمانی دڵخوازت هەڵبژێرە' : 'Select your preferred language'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 items-center">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending || locale === lang.code}
                className={`w-24 h-8 rounded-xl font-bold border-2 text-base flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#386641]/55
                  ${locale === lang.code
                    ? 'bg-[#386641] text-white border-[#386641] shadow'
                    : 'bg-white text-[#386641] border-[#386641] hover:bg-[#386641]/90 hover:text-white'}
                `}
                aria-current={locale === lang.code ? 'true' : undefined}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
