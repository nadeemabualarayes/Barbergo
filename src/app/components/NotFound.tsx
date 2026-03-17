import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { useI18n } from '../i18n';
import { Button } from './ui/button';

export function NotFound() {
  const { locale } = useI18n();
  const copy =
    locale === 'ar'
      ? { title: 'الصفحة غير موجودة', goHome: 'العودة إلى لوحة التحكم' }
      : { title: 'Page not found', goHome: 'Go to Dashboard' };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">{copy.title}</p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4 mr-2" />
          {copy.goHome}
        </Button>
      </Link>
    </div>
  );
}
