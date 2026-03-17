import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { arSA, enUS } from 'date-fns/locale';

type Locale = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';
type DictionaryValue = string | Record<string, DictionaryValue>;

const dictionaries = {
  en: {
    common: {
      appName: 'BarberGo',
      save: 'Save',
      cancel: 'Cancel',
      continue: 'Continue',
      back: 'Back',
      logout: 'Logout',
      loading: 'Loading...',
      search: 'Search',
      today: 'Today',
      yesterday: 'Yesterday',
      days: 'days',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months',
      ago: 'ago',
      language: 'Language',
      english: 'English',
      arabic: 'Arabic',
    },
    nav: {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      barbers: 'Barbers',
      services: 'Services',
      customers: 'Customers',
      analytics: 'Analytics',
      settings: 'Settings',
    },
  },
  ar: {
    common: {
      appName: 'باربر جو',
      save: 'حفظ',
      cancel: 'إلغاء',
      continue: 'متابعة',
      back: 'رجوع',
      logout: 'تسجيل الخروج',
      loading: 'جار التحميل...',
      search: 'بحث',
      today: 'اليوم',
      yesterday: 'أمس',
      days: 'أيام',
      week: 'أسبوع',
      weeks: 'أسابيع',
      month: 'شهر',
      months: 'أشهر',
      ago: 'منذ',
      language: 'اللغة',
      english: 'الإنجليزية',
      arabic: 'العربية',
    },
    nav: {
      dashboard: 'لوحة التحكم',
      appointments: 'المواعيد',
      barbers: 'الحلاقون',
      services: 'الخدمات',
      customers: 'العملاء',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
    },
  },
} satisfies Record<Locale, Record<string, DictionaryValue>>;

const LOCALE_STORAGE_KEY = 'barbergo_locale';

interface I18nContextValue {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (value: number) => string;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatDateTime: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number) => string;
  formatRelativeDate: (value: Date | string) => string;
  getDateFnsLocale: () => typeof enUS;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveValue(locale: Locale, key: string): string | undefined {
  const segments = key.split('.');
  let value: DictionaryValue | undefined = dictionaries[locale];
  for (const segment of segments) {
    if (typeof value !== 'object' || value === null || !(segment in value)) {
      return undefined;
    }
    value = (value as Record<string, DictionaryValue>)[segment];
  }
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_match, rawKey) => {
    const key = String(rawKey).trim();
    return String(params[key] ?? '');
  });
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === 'ar' || stored === 'en' ? stored : 'en';
  });

  const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [direction, locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, params?: Record<string, string | number>) => {
      const template = resolveValue(locale, key) ?? resolveValue('en', key) ?? key;
      return interpolate(template, params);
    };

    const localeTag = locale === 'ar' ? 'ar' : 'en-US';

    return {
      locale,
      direction,
      setLocale,
      t,
      formatCurrency: (value: number) =>
        new Intl.NumberFormat(localeTag, {
          style: 'currency',
          currency: 'ILS',
          maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
        }).format(value),
      formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(localeTag, options).format(toDate(value)),
      formatTime: (value: Date | string, options?: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(localeTag, {
          hour: 'numeric',
          minute: '2-digit',
          ...options,
        }).format(toDate(value)),
      formatDateTime: (value: Date | string, options?: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(localeTag, {
          dateStyle: 'medium',
          timeStyle: 'short',
          ...options,
        }).format(toDate(value)),
      formatNumber: (value: number) => new Intl.NumberFormat(localeTag).format(value),
      formatRelativeDate: (value: Date | string) => {
        const date = toDate(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return t('common.today');
        if (diffDays === 1) return t('common.yesterday');
        if (diffDays < 7) {
          return `${new Intl.NumberFormat(localeTag).format(diffDays)} ${t('common.days')} ${t('common.ago')}`;
        }
        if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          return `${new Intl.NumberFormat(localeTag).format(weeks)} ${weeks === 1 ? t('common.week') : t('common.weeks')} ${t('common.ago')}`;
        }
        const months = Math.floor(diffDays / 30);
        return `${new Intl.NumberFormat(localeTag).format(months)} ${months === 1 ? t('common.month') : t('common.months')} ${t('common.ago')}`;
      },
      getDateFnsLocale: () => (locale === 'ar' ? arSA : enUS),
    };
  }, [direction, locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
