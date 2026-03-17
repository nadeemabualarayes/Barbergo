import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, LogOut, Scissors, Star, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../i18n';
import { LanguageToggle } from '../LanguageToggle';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export function CustomerHome() {
  const navigate = useNavigate();
  const { locale, direction } = useI18n();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const copy =
    locale === 'ar'
      ? {
          guest: 'زائر',
          welcome: 'أهلا بعودتك، {{name}}!',
          subtitle: 'هل أنت مستعد لتجربة عناية جديدة؟',
          bookAppointment: 'احجز موعدا',
          bookDescription: 'حدد موعد جلستك القادمة',
          myAppointments: 'مواعيدي',
          appointmentsDescription: 'اعرض حجوزاتك وأدرها',
          myProfile: 'ملفي الشخصي',
          profileDescription: 'حدّث معلوماتك',
          servicesTitle: 'خدماتنا',
          servicesSubtitle: 'اختر من خدمات العناية المميزة لدينا',
          barbering: 'الحلاقة',
          barberingDescription: 'قصات شعر احترافية وتدريجات وتصفيف',
          cupping: 'الحجامة',
          cuppingDescription: 'علاج تقليدي لتحسين الصحة والعافية',
          skincare: 'العناية بالبشرة',
          skincareDescription: 'جلسات وجه وعناية متقدمة',
          ctaTitle: 'جاهز لتبدو بأفضل حال؟',
          ctaDescription: 'احجز موعدا مع خبرائنا اليوم',
          home: 'الرئيسية',
          book: 'احجز',
          appointments: 'المواعيد',
          profile: 'الملف الشخصي',
          logout: 'تسجيل الخروج',
        }
      : {
          guest: 'Guest',
          welcome: 'Welcome back, {{name}}!',
          subtitle: 'Ready for your next grooming experience?',
          bookAppointment: 'Book Appointment',
          bookDescription: 'Schedule your next grooming session',
          myAppointments: 'My Appointments',
          appointmentsDescription: 'View and manage your bookings',
          myProfile: 'My Profile',
          profileDescription: 'Update your information',
          servicesTitle: 'Our Services',
          servicesSubtitle: 'Choose from our premium grooming services',
          barbering: 'Barbering',
          barberingDescription: 'Professional haircuts, fades, and styling',
          cupping: 'Cupping (Hajama)',
          cuppingDescription: 'Traditional therapeutic treatment',
          skincare: 'Skin Care',
          skincareDescription: 'Premium facial treatments and care',
          ctaTitle: 'Ready to look your best?',
          ctaDescription: 'Book an appointment with our expert barbers today',
          home: 'Home',
          book: 'Book',
          appointments: 'Appointments',
          profile: 'Profile',
          logout: 'Logout',
        };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setProfile({
        name: user.user_metadata?.name || copy.guest,
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/customer/login');
  };

  const welcomeTitle = copy.welcome.replace('{{name}}', profile?.name || copy.guest);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{locale === 'ar' ? 'باربر جو' : 'BarberGo'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {copy.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{welcomeTitle}</h2>
            <p className="text-slate-600">{copy.subtitle}</p>
          </div>
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-red-100 text-red-700 font-semibold">
              {(profile?.name || copy.guest).charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/book')}>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>{copy.bookAppointment}</CardTitle>
              <CardDescription>{copy.bookDescription}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/appointments')}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>{copy.myAppointments}</CardTitle>
              <CardDescription>{copy.appointmentsDescription}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/profile')}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>{copy.myProfile}</CardTitle>
              <CardDescription>{copy.profileDescription}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{copy.servicesTitle}</CardTitle>
            <CardDescription>{copy.servicesSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg text-white">
                <Scissors className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{copy.barbering}</h3>
                <p className="text-sm text-slate-300">{copy.barberingDescription}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 rounded-lg text-white">
                <Star className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{copy.cupping}</h3>
                <p className="text-sm text-red-100">{copy.cuppingDescription}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white">
                <User className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{copy.skincare}</h3>
                <p className="text-sm text-blue-100">{copy.skincareDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{copy.ctaTitle}</h3>
                <p className="text-red-100">{copy.ctaDescription}</p>
              </div>
              <Button size="lg" variant="secondary" onClick={() => navigate('/customer/book')}>
                {copy.bookAppointment}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t md:hidden ${direction === 'rtl' ? 'text-right' : ''}`}>
        <div className="grid grid-cols-4 gap-1 p-2">
          <button className="flex flex-col items-center py-2 text-red-600" onClick={() => navigate('/customer/home')}>
            <Scissors className="w-5 h-5 mb-1" />
            <span className="text-xs">{copy.home}</span>
          </button>
          <button className="flex flex-col items-center py-2 text-slate-600" onClick={() => navigate('/customer/book')}>
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">{copy.book}</span>
          </button>
          <button className="flex flex-col items-center py-2 text-slate-600" onClick={() => navigate('/customer/appointments')}>
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">{copy.appointments}</span>
          </button>
          <button className="flex flex-col items-center py-2 text-slate-600" onClick={() => navigate('/customer/profile')}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">{copy.profile}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
