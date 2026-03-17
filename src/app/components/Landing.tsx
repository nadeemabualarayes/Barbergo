import { useNavigate } from 'react-router';
import { ArrowRight, Scissors, Shield, Sparkles, UserCog, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';

export function Landing() {
  const navigate = useNavigate();
  const { locale, direction } = useI18n();

  const copy =
    locale === 'ar'
      ? {
          eyebrow: 'منصة عناية رجالية فاخرة',
          title: 'تجربة حجز وإدارة أنيقة لصالونك الحديث',
          description:
            'واجهة هادئة ومرنة لإدارة الحلاقة والحجامة والعناية بالبشرة، مع تجربة حجز مباشرة وأسلوب بصري راق يركز على الراحة والوضوح.',
          ambience: 'أجواء فاخرة، تنظيم مرن، ومساحة مريحة للعين.',
          customerTitle: 'الحجز المباشر',
          customerDescription: 'اسم ورقم هاتف فقط، ثم اختيار الخدمة والحلاق والوقت المناسب.',
          customerAction: 'ابدأ الحجز',
          barberTitle: 'بوابة الحلاقين',
          barberDescription: 'واجهة يومية واضحة لمتابعة المواعيد والجدول والأرباح.',
          barberAction: 'دخول الموظفين',
          adminTitle: 'لوحة الإدارة',
          adminDescription: 'إدارة شاملة للخدمات والموظفين والعملاء والتحليلات.',
          adminAction: 'دخول الإدارة',
          servicesTitle: 'الخدمات الأساسية',
          barbering: 'قصات دقيقة وتصفيف احترافي',
          cupping: 'جلسات حجامة وعناية علاجية',
          skincare: 'عناية بالبشرة ولمسات نهائية',
          flexibleTitle: 'واجهة مرنة وعصرية',
          flexibleDescription:
            'مصممة لتبقى واضحة على الجوال وسطح المكتب، مع تباين مريح وألوان دافئة ومساحات تنفس كبيرة.',
          tagline: 'باربر جو',
          subtagline: 'أسلوب بصري راق لخدمات العناية الرجالية',
        }
      : {
          eyebrow: 'Premium Men’s Grooming Platform',
          title: 'An elegant booking and operations hub for the modern barbershop',
          description:
            'A calmer, more flexible experience for barbering, cupping, and skin care services, with direct customer booking and a refined visual tone built for comfort.',
          ambience: 'Luxury atmosphere, flexible structure, and generous negative space.',
          customerTitle: 'Direct Booking',
          customerDescription: 'Name and phone number only, then choose services, barber, and appointment time.',
          customerAction: 'Book Now',
          barberTitle: 'Barber Portal',
          barberDescription: 'A focused daily workspace for appointments, schedule management, and earnings.',
          barberAction: 'Staff Login',
          adminTitle: 'Admin Portal',
          adminDescription: 'A complete control room for services, staff, customers, and business analytics.',
          adminAction: 'Admin Login',
          servicesTitle: 'Core Services',
          barbering: 'Precision cuts and elevated styling',
          cupping: 'Cupping sessions and therapeutic care',
          skincare: 'Skin treatments and finishing care',
          flexibleTitle: 'Modern and Flexible',
          flexibleDescription:
            'Built to feel clear on both desktop and mobile, with soft contrast, warm tones, and plenty of room to breathe.',
          tagline: 'BarberGo',
          subtagline: 'A refined visual system for premium men’s grooming',
        };

  const portals = [
    {
      title: copy.customerTitle,
      description: copy.customerDescription,
      action: copy.customerAction,
      icon: Users,
      accent: 'from-[#d4b06a] via-[#f0d59d] to-[#c89b45]',
      surface: 'bg-[linear-gradient(180deg,rgba(28,24,20,0.95),rgba(20,18,16,0.88))]',
      border: 'border-[#c89b45]/35',
      actionClass:
        'bg-[linear-gradient(135deg,#d4b06a,#f1ddb4)] text-[#17130f] hover:brightness-105',
      onClick: () => navigate('/customer/book'),
    },
    {
      title: copy.barberTitle,
      description: copy.barberDescription,
      action: copy.barberAction,
      icon: UserCog,
      accent: 'from-[#7b5b2a] via-[#d4b06a] to-[#f5e6c3]',
      surface: 'bg-[linear-gradient(180deg,rgba(21,21,19,0.92),rgba(17,17,16,0.86))]',
      border: 'border-[#f1ddb4]/20',
      actionClass:
        'border border-[#d4b06a]/35 bg-[#1b1814]/80 text-[#f6e9cc] hover:bg-[#241f19]',
      onClick: () => navigate('/barber/login'),
    },
    {
      title: copy.adminTitle,
      description: copy.adminDescription,
      action: copy.adminAction,
      icon: Shield,
      accent: 'from-[#b88b3d] via-[#d9bf84] to-[#f7edd5]',
      surface: 'bg-[linear-gradient(180deg,rgba(24,22,19,0.94),rgba(18,17,15,0.88))]',
      border: 'border-[#d9bf84]/24',
      actionClass:
        'border border-[#d9bf84]/35 bg-[#151311]/82 text-[#f6e9cc] hover:bg-[#1e1a16]',
      onClick: () => navigate('/login'),
    },
  ];

  const serviceHighlights = [copy.barbering, copy.cupping, copy.skincare];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0f0d0b] text-[#f6e9cc]"
      style={{ fontFamily: locale === 'ar' ? '"Segoe UI", Tahoma, sans-serif' : '"Georgia", "Times New Roman", serif' }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2f2618_0%,#14110e_38%,#0b0908_75%)]" />
        <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[#c89b45]/12 blur-3xl" />
        <div className="absolute top-[20%] right-[12%] h-96 w-80 rounded-full bg-[#f0d59d]/8 blur-3xl" />
        <div className="absolute bottom-[8%] left-[18%] h-72 w-72 rounded-full bg-[#6d5531]/18 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />
        <div className="absolute left-[12%] top-[14%] h-64 w-48 rounded-[2rem] border border-white/6 bg-white/4 blur-[2px]" />
        <div className="absolute right-[14%] top-[18%] h-72 w-52 rounded-[2.5rem] border border-white/6 bg-white/4 blur-[1px]" />
        <div className="absolute left-[28%] bottom-[14%] h-52 w-64 rounded-[2rem] border border-white/6 bg-white/3 blur-[2px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.26),rgba(8,7,6,0.72))]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-6 md:px-8 lg:px-10">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#1a1714]/72 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b88b3d,#f1ddb4)] shadow-[0_12px_40px_rgba(200,155,69,0.22)]">
              <Scissors className="h-7 w-7 text-[#16120d]" />
            </div>
            <div>
              <p className="text-[1.9rem] font-semibold tracking-tight text-[#fff8eb]">{copy.tagline}</p>
              <p className="text-sm text-[#d7c7a6]/80">{copy.subtagline}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-14 text-center md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4b06a]/25 bg-[#1b1712]/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#d9bf84] backdrop-blur-lg">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{copy.eyebrow}</span>
          </div>

          <div className="max-w-4xl space-y-6">
            <h1
              className="text-5xl font-semibold leading-tight text-[#fff7e7] md:text-7xl"
              style={{ fontFamily: locale === 'ar' ? '"Segoe UI", Tahoma, sans-serif' : '"Baskerville Old Face", "Palatino Linotype", serif' }}
            >
              {copy.title}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-[#dfd1b5]/88 md:text-xl">{copy.description}</p>
            <p className="mx-auto max-w-2xl text-sm uppercase tracking-[0.28em] text-[#cba764]/80">{copy.ambience}</p>
          </div>

          <div className="mt-14 grid w-full gap-6 md:grid-cols-3">
            {portals.map((portal) => (
              <section
                key={portal.title}
                className={`group relative overflow-hidden rounded-[2rem] border ${portal.border} ${portal.surface} p-7 text-left shadow-[0_18px_80px_rgba(0,0,0,0.26)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${portal.accent}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${portal.accent}`}>
                      <portal.icon className="h-7 w-7 text-[#17130f]" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-semibold text-[#fff7e7]">{portal.title}</h2>
                      <p className="min-h-[88px] text-base leading-7 text-[#decfb0]/82">{portal.description}</p>
                    </div>
                  </div>
                </div>
                <Button
                  className={`mt-8 h-12 w-full rounded-full text-sm font-semibold tracking-[0.08em] ${portal.actionClass}`}
                  onClick={portal.onClick}
                >
                  <span>{portal.action}</span>
                  <ArrowRight className={`ml-2 h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </Button>
              </section>
            ))}
          </div>

          <div className="mt-16 w-full rounded-[2rem] border border-white/8 bg-[#171411]/68 p-6 backdrop-blur-xl md:p-8">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#cba764]">{copy.servicesTitle}</p>
              <h3
                className="text-2xl font-semibold text-[#fff7e7] md:text-3xl"
                style={{ fontFamily: locale === 'ar' ? '"Segoe UI", Tahoma, sans-serif' : '"Baskerville Old Face", "Palatino Linotype", serif' }}
              >
                {copy.flexibleTitle}
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-[#decfb0]/78 md:text-base">{copy.flexibleDescription}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {serviceHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.6rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-6 text-center text-sm leading-7 text-[#f3e7ca]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
