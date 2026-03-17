import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import { useI18n } from '../../i18n';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface Service {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
  is_active: boolean;
}

export function SelectServicesPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const copy = useMemo(
    () =>
      locale === 'ar'
        ? {
            back: 'رجوع',
            title: 'اختر الخدمات',
            step: 'الخطوة 1 من 3',
            selectService: 'يرجى اختيار خدمة واحدة على الأقل',
            selectedSingle: 'تم اختيار خدمة واحدة',
            selectedPlural: 'تم اختيار {{count}} خدمات',
            total: 'الإجمالي',
            minutes: 'دقيقة',
            continue: 'متابعة',
            minuteShort: 'د',
          }
        : {
            back: 'Back',
            title: 'Select Services',
            step: 'Step 1 of 3',
            selectService: 'Please select at least one service',
            selectedSingle: '1 service selected',
            selectedPlural: '{{count}} services selected',
            total: 'Total',
            minutes: 'minutes',
            continue: 'Continue',
            minuteShort: 'min',
          },
    [locale],
  );

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/services`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      const activeServices = Array.isArray(data) ? data.filter((service: any) => service.is_active) : [];
      setServices(activeServices);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([
        {
          id: '1',
          title: locale === 'ar' ? 'قصة كلاسيكية' : 'Classic Haircut',
          category: locale === 'ar' ? 'الحلاقة' : 'Barbering',
          duration_minutes: 30,
          price: 35,
          description: locale === 'ar' ? 'قصة شعر تقليدية مع تصفيف' : 'Traditional haircut with styling',
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service: Service) => {
    if (selectedServices.find((selected) => selected.id === service.id)) {
      setSelectedServices(selectedServices.filter((selected) => selected.id !== service.id));
      return;
    }
    setSelectedServices([...selectedServices, service]);
  };

  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration_minutes, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      alert(copy.selectService);
      return;
    }
    sessionStorage.setItem('bookingServices', JSON.stringify(selectedServices));
    navigate('/customer/book/select-barber');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Barbering':
      case 'الحلاقة':
        return 'bg-blue-100 text-blue-800';
      case 'Cupping':
      case 'الحجامة':
        return 'bg-purple-100 text-purple-800';
      case 'Skin Care':
      case 'العناية بالبشرة':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const selectedLabel =
    selectedServices.length === 1
      ? copy.selectedSingle
      : copy.selectedPlural.replace('{{count}}', String(selectedServices.length));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {copy.back}
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">{copy.title}</h1>
            <p className="text-xs text-slate-600">{copy.step}</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">{category}</h2>
            <div className="grid gap-4">
              {categoryServices.map((service) => {
                const isSelected = selectedServices.some((selected) => selected.id === service.id);
                return (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-red-600 bg-red-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-slate-900">{service.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center text-sm text-slate-700">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.duration_minutes} {copy.minuteShort}
                                </span>
                                <span className="flex items-center text-sm font-semibold text-green-700">
                                  ₪{service.price}
                                </span>
                              </div>
                            </div>
                            <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">{selectedLabel}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm font-semibold text-slate-900">
                    {copy.total}: ₪{totalPrice}
                  </span>
                  <span className="text-sm text-slate-600">
                    {totalDuration} {copy.minutes}
                  </span>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleContinue}>
                {copy.continue}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
