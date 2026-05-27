import { useBudgetStore } from '@/lib/store';
import { th } from './th';
import { en } from './en';

const dictionaries = {
  th,
  en,
};

export type TranslationKey = keyof typeof th;

/**
 * Hook สำหรับดึงคำแปลภาษา
 * @returns { t: (key: TranslationKey) => string, language: 'th' | 'en' }
 */
export function useTranslation() {
  const { language } = useBudgetStore();
  const dict = dictionaries[language] || dictionaries.th;

  const t = (key: TranslationKey): string => {
    return dict[key] || key;
  };

  return { t, language };
}
