import { Languages } from 'lucide-react';
import { useI18n } from '../i18n';

type LanguageToggleProps = {
  variant?: 'default' | 'immersive';
  className?: string;
};

export function LanguageToggle({ variant = 'default', className = '' }: LanguageToggleProps) {
  const { locale, setLocale, t } = useI18n();

  const isImmersive = variant === 'immersive';

  return (
    <div
      className={[
        'inline-flex items-center gap-1 rounded-full p-1 shadow-sm',
        isImmersive
          ? 'border border-[#d4b06a]/20 bg-[#15120f]/78 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.24)]'
          : 'border border-slate-200 bg-white/90',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center gap-2 px-3',
          isImmersive ? 'text-[#d4b06a]' : 'text-slate-500',
        ].join(' ')}
      >
        <Languages className="h-4 w-4" />
        <span className={['text-xs font-medium', isImmersive ? 'tracking-[0.2em] uppercase' : ''].join(' ')}>
          {t('common.language')}
        </span>
      </div>

      <button
        type="button"
        className={[
          'h-9 rounded-full px-4 text-sm font-semibold transition-all',
          locale === 'ar'
            ? isImmersive
              ? 'bg-[linear-gradient(135deg,#d4b06a,#f1ddb4)] text-[#17130f] shadow-[0_6px_24px_rgba(200,155,69,0.24)]'
              : 'bg-[#0f1025] text-white'
            : isImmersive
              ? 'text-[#f5e8ca]/78 hover:bg-white/6'
              : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')}
        onClick={() => setLocale('ar')}
      >
        {t('common.arabic')}
      </button>

      <button
        type="button"
        className={[
          'h-9 rounded-full px-4 text-sm font-semibold transition-all',
          locale === 'en'
            ? isImmersive
              ? 'bg-[linear-gradient(135deg,#d4b06a,#f1ddb4)] text-[#17130f] shadow-[0_6px_24px_rgba(200,155,69,0.24)]'
              : 'bg-[#0f1025] text-white'
            : isImmersive
              ? 'text-[#f5e8ca]/78 hover:bg-white/6'
              : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')}
        onClick={() => setLocale('en')}
      >
        {t('common.english')}
      </button>
    </div>
  );
}
