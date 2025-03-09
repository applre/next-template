'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import type { Route } from 'next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const locales = ['en', 'zh'] as const;
type Locale = (typeof locales)[number];

const labels: Record<Locale, string> = {
  en: '🇬🇧 English',
  zh: '🇨🇳 中文',
};

export function SelectLanguage() {
  const pathname = usePathname() as Route;
  const router = useRouter();
  const locale = useLocale();

  return (
    <Select
      value={locale}
      onValueChange={(value) => router.push(pathname, { locale: value as Locale })}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {labels[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
