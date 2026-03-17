import { Languages } from 'lucide-react';
import { Button } from './ui/button';
import { useI18n } from '../i18n';

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm">
      <div className="flex items-center gap-1 px-2 text-slate-500">
        <Languages className="h-4 w-4" />
        <span className="text-xs font-medium">{t('common.language')}</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant={locale === 'en' ? 'default' : 'ghost'}
        className="h-8 rounded-full px-3"
        onClick={() => setLocale('en')}
      >
        {t('common.english')}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={locale === 'ar' ? 'default' : 'ghost'}
        className="h-8 rounded-full px-3"
        onClick={() => setLocale('ar')}
      >
        {t('common.arabic')}
      </Button>
    </div>
  );
}
