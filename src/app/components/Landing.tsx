import { useNavigate } from 'react-router';
import { Scissors, Shield, UserCog, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Landing() {
  const navigate = useNavigate();
  const { locale, t } = useI18n();

  const copy =
    locale === 'ar'
      ? {
          tagline: 'خدمات عناية رجالية مميزة',
          heroTitle: 'أهلا بك في باربر جو',
          heroDescription: 'نظامك المتكامل لإدارة أعمال الحلاقة والحجامة والعناية بالبشرة',
          customerPortal: 'بوابة العملاء',
          customerDescription: 'احجز مواعيدك وأدر جلسات العناية الخاصة بك',
          barberPortal: 'بوابة الحلاقين',
          barberDescription: 'أدر قائمة اليوم وتابع أرباحك',
          adminPortal: 'بوابة الإدارة',
          adminDescription: 'إدارة كاملة للأعمال والتحليلات',
          adminProvided: 'بيانات الدخول يوفرها المدير',
          servicesTitle: 'خدماتنا',
          barberingTitle: 'الحلاقة',
          barberingDescription: 'قصات شعر احترافية وتدريجات وتصفيف',
          cuppingTitle: 'الحجامة',
          cuppingDescription: 'علاج تقليدي لتحسين الصحة والعافية',
          skincareTitle: 'العناية بالبشرة',
          skincareDescription: 'جلسات وجه وعناية متقدمة',
          footer: 'نظام شامل لإدارة الأعمال',
          staffLogin: 'دخول الموظفين',
          adminLogin: 'دخول الإدارة',
        }
      : {
          tagline: "Premium Men's Grooming Services",
          heroTitle: 'Welcome to BarberGo',
          heroDescription:
            'Your complete business management system for barbering, cupping (hajama), and skin care services',
          customerPortal: 'Customer Portal',
          customerDescription: 'Book appointments and manage your grooming sessions',
          barberPortal: 'Barber Portal',
          barberDescription: 'Manage your daily queue and track earnings',
          adminPortal: 'Admin Portal',
          adminDescription: 'Full business management and analytics',
          adminProvided: 'Credentials provided by admin',
          servicesTitle: 'Our Services',
          barberingTitle: 'Barbering',
          barberingDescription: 'Professional haircuts, fades, and styling services',
          cuppingTitle: 'Cupping (Hajama)',
          cuppingDescription: 'Traditional therapeutic treatment for wellness',
          skincareTitle: 'Skin Care',
          skincareDescription: 'Premium facial treatments and grooming care',
          footer: 'Comprehensive Business Management System',
          staffLogin: 'Staff Login',
          adminLogin: 'Admin Login',
        };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{t('common.appName')}</h1>
                <p className="text-slate-400 text-sm">{copy.tagline}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">{copy.heroTitle}</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">{copy.heroDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-red-600 transition-all hover:shadow-xl hover:shadow-red-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">{copy.customerPortal}</CardTitle>
              <CardDescription className="text-slate-400">{copy.customerDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => navigate('/customer/login')}>
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate('/customer/signup')}
              >
                {locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-600 transition-all hover:shadow-xl hover:shadow-blue-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">{copy.barberPortal}</CardTitle>
              <CardDescription className="text-slate-400">{copy.barberDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/barber/login')}>
                {copy.staffLogin}
              </Button>
              <p className="text-xs text-center text-slate-500">{copy.adminProvided}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-green-600 transition-all hover:shadow-xl hover:shadow-green-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">{copy.adminPortal}</CardTitle>
              <CardDescription className="text-slate-400">{copy.adminDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/login')}>
                {copy.adminLogin}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">{copy.servicesTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <Scissors className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">{copy.barberingTitle}</h4>
              <p className="text-slate-400 text-sm">{copy.barberingDescription}</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="w-10 h-10 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-xl">*</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{copy.cuppingTitle}</h4>
              <p className="text-slate-400 text-sm">{copy.cuppingDescription}</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <Users className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">{copy.skincareTitle}</h4>
              <p className="text-slate-400 text-sm">{copy.skincareDescription}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-slate-500 text-sm">{`© 2026 ${t('common.appName')} - ${copy.footer}`}</p>
        </div>
      </footer>
    </div>
  );
}
