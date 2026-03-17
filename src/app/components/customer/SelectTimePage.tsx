import { useEffect, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';

export function SelectTimePage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);

  const copy = useMemo(
    () =>
      locale === 'ar'
        ? {
            back: 'رجوع',
            title: 'اختر التاريخ والوقت',
            step: 'الخطوة 3 من 3',
            chooseDate: 'اختر التاريخ',
            availableTimes: 'الأوقات المتاحة ليوم {{date}}',
            loadingSlots: 'جار تحميل الأوقات المتاحة...',
            noSlots: 'لا توجد أوقات متاحة لهذا اليوم',
            chooseDifferentDate: 'يرجى اختيار يوم آخر',
            summary: 'ملخص الحجز',
            services: 'الخدمات',
            barber: 'الحلاق',
            duration: 'المدة',
            totalPrice: 'السعر الإجمالي',
            selectedTime: 'الوقت المحدد',
            reviewBooking: 'مراجعة الحجز',
            selectDateTime: 'يرجى اختيار التاريخ والوقت',
            minutes: 'دقيقة',
          }
        : {
            back: 'Back',
            title: 'Select Date & Time',
            step: 'Step 3 of 3',
            chooseDate: 'Choose Date',
            availableTimes: 'Available Times for {{date}}',
            loadingSlots: 'Loading available slots...',
            noSlots: 'No available slots for this date',
            chooseDifferentDate: 'Please select a different date',
            summary: 'Booking Summary',
            services: 'Services',
            barber: 'Barber',
            duration: 'Duration',
            totalPrice: 'Total Price',
            selectedTime: 'Selected Time',
            reviewBooking: 'Review Booking',
            selectDateTime: 'Please select date and time',
            minutes: 'minutes',
          },
    [locale],
  );

  useEffect(() => {
    const servicesData = sessionStorage.getItem('bookingServices');
    const barberData = sessionStorage.getItem('bookingBarber');

    if (!servicesData || !barberData) {
      navigate('/customer/book');
      return;
    }

    setSelectedServices(JSON.parse(servicesData));
    setSelectedBarber(JSON.parse(barberData));
  }, [navigate]);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedBarber]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const slots = generateMockSlots();
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots.filter((_, index) => index % 3 !== 0);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      alert(copy.selectDateTime);
      return;
    }

    const bookingData = {
      services: selectedServices,
      barber: selectedBarber,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/customer/book/confirm');
  };

  const totalDuration = selectedServices.reduce(
    (sum: number, service: any) => sum + (service.duration_minutes || service.duration || 0),
    0,
  );
  const totalPrice = selectedServices.reduce((sum: number, service: any) => sum + (service.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/book/select-barber')}>
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
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">{copy.chooseDate}</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">
                {copy.availableTimes.replace('{{date}}', format(selectedDate, 'MMMM d, yyyy'))}
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">{copy.loadingSlots}</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600">{copy.noSlots}</p>
                  <p className="text-sm text-slate-500 mt-1">{copy.chooseDifferentDate}</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        selectedTime === slot
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-slate-200 hover:border-red-600 hover:bg-red-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-50">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">{copy.summary}</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">{copy.services}</p>
                <p className="font-medium">{selectedServices.map((service) => service.title || service.name).join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{copy.barber}</p>
                <p className="font-medium">{selectedBarber?.name}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-slate-600">{copy.duration}</p>
                  <p className="font-medium">{totalDuration} {copy.minutes}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{copy.totalPrice}</p>
                  <p className="font-medium text-green-700">₪{totalPrice}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {selectedDate && selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">{copy.selectedTime}</p>
                <p className="font-semibold text-slate-900">
                  {format(selectedDate, 'MMM d, yyyy')} {locale === 'ar' ? 'الساعة' : 'at'} {selectedTime}
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleContinue}>
                {copy.reviewBooking}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
