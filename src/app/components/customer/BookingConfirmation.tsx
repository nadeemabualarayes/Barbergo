import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Loader2,
  Phone,
  Scissors,
  User,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import { useI18n } from '../../i18n';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function BookingConfirmation() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const copy =
    locale === 'ar'
      ? {
          missingDetails: 'يرجى إدخال الاسم ورقم الهاتف.',
          failedCreate: 'فشل إنشاء الموعد',
          confirmedTitle: 'تم تأكيد الحجز!',
          confirmedDescription:
            'تم إرسال طلب الموعد بنجاح. سنتواصل معك على رقم الهاتف الذي أدخلته إذا لزم الأمر.',
          bookAnother: 'احجز موعدا آخر',
          backHome: 'العودة إلى الرئيسية',
          back: 'رجوع',
          confirmTitle: 'تأكيد الحجز',
          yourDetails: 'بياناتك',
          name: 'الاسم',
          namePlaceholder: 'أدخل اسمك',
          phone: 'رقم الهاتف',
          phonePlaceholder: '+970 00 000 0000',
          appointmentDetails: 'تفاصيل الموعد',
          dateTime: 'التاريخ والوقت',
          barber: 'الحلاق',
          contactNumber: 'رقم التواصل',
          addPhone: 'أدخل رقم هاتفك بالأعلى',
          services: 'الخدمات',
          totalDuration: 'إجمالي المدة',
          totalPrice: 'السعر الإجمالي',
          directBooking: 'الحجز المباشر:',
          directBookingDescription: 'أدخل اسمك ورقم هاتفك ثم أكد الحجز. لا حاجة إلى حساب.',
          confirming: 'جار التأكيد...',
          confirmButton: 'تأكيد الحجز',
          minutes: 'دقيقة',
        }
      : {
          missingDetails: 'Please enter your name and phone number.',
          failedCreate: 'Failed to create appointment',
          confirmedTitle: 'Booking Confirmed!',
          confirmedDescription:
            'Your appointment request has been submitted successfully. We will contact you on the phone number you entered if needed.',
          bookAnother: 'Book Another Appointment',
          backHome: 'Back to Home',
          back: 'Back',
          confirmTitle: 'Confirm Booking',
          yourDetails: 'Your Details',
          name: 'Name',
          namePlaceholder: 'Enter your name',
          phone: 'Phone Number',
          phonePlaceholder: '+970 00 000 0000',
          appointmentDetails: 'Appointment Details',
          dateTime: 'Date & Time',
          barber: 'Barber',
          contactNumber: 'Contact Number',
          addPhone: 'Add your phone number above',
          services: 'Services',
          totalDuration: 'Total Duration',
          totalPrice: 'Total Price',
          directBooking: 'Direct booking:',
          directBookingDescription: 'Enter your name and phone number, then confirm. No account is required.',
          confirming: 'Confirming...',
          confirmButton: 'Confirm Booking',
          minutes: 'minutes',
        };

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (!data) {
      navigate('/customer/book');
      return;
    }
    setBookingData(JSON.parse(data));
  }, [navigate]);

  const totals = useMemo(() => {
    if (!bookingData) {
      return { totalDuration: 0, totalPrice: 0 };
    }

    return {
      totalDuration: bookingData.services.reduce(
        (sum: number, service: any) => sum + (service.duration_minutes || service.duration || 0),
        0,
      ),
      totalPrice: bookingData.services.reduce((sum: number, service: any) => sum + (service.price || 0), 0),
    };
  }, [bookingData]);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setError(copy.missingDetails);
      setLoading(false);
      return;
    }

    try {
      const customerId = `guest-${customerPhone.replace(/\D/g, '')}`;
      const appointmentData = {
        customer_id: customerId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: '',
        barber_id: bookingData.barber.id === 'any' ? 'any' : bookingData.barber.id,
        barber_name: bookingData.barber.name,
        services: bookingData.services.map((service: any) => ({
          id: service.id,
          title: service.title || service.name,
          duration_minutes: service.duration_minutes || service.duration,
          price: service.price,
          category: service.category,
        })),
        service_ids: bookingData.services.map((service: any) => service.id),
        service_titles: bookingData.services.map((service: any) => service.title || service.name),
        date: bookingData.date,
        start_time: new Date(`${bookingData.date}T${bookingData.time}`).toISOString(),
        end_time: new Date(
          new Date(`${bookingData.date}T${bookingData.time}`).getTime() + totals.totalDuration * 60000,
        ).toISOString(),
        total_duration: totals.totalDuration,
        total_price: totals.totalPrice,
        status: 'pending',
        payment_status: 'pending',
        notes: '',
        created_at: new Date().toISOString(),
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(appointmentData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || copy.failedCreate);
      }

      sessionStorage.removeItem('bookingServices');
      sessionStorage.removeItem('bookingBarber');
      sessionStorage.removeItem('bookingData');

      setSuccess(true);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || copy.failedCreate);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{copy.confirmedTitle}</h2>
            <p className="text-slate-600 mb-6">{copy.confirmedDescription}</p>
            <div className="space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => navigate('/customer/book')}>
                {copy.bookAnother}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                {copy.backHome}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/book/select-time')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {copy.back}
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">{copy.confirmTitle}</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{copy.yourDetails}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">{copy.name}</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">{copy.phone}</Label>
                  <Input
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={copy.phonePlaceholder}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{copy.appointmentDetails}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">{copy.dateTime}</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-700">{bookingData.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">{copy.barber}</p>
                  <p className="font-semibold text-slate-900">{bookingData.barber.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">{copy.contactNumber}</p>
                  <p className="font-semibold text-slate-900">{customerPhone || copy.addPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Scissors className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">{copy.services}</p>
                  <div className="space-y-2">
                    {bookingData.services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{service.title || service.name}</p>
                          <p className="text-sm text-slate-600">
                            {service.duration_minutes || service.duration} {copy.minutes}
                          </p>
                        </div>
                        <p className="font-semibold text-green-700">₪{service.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t">
                <DollarSign className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">{copy.totalDuration}</p>
                    <p className="font-semibold text-slate-900">{totals.totalDuration} {copy.minutes}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">{copy.totalPrice}</p>
                    <p className="text-2xl font-bold text-green-700">₪{totals.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              <strong>{copy.directBooking}</strong> {copy.directBookingDescription}
            </p>
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleConfirmBooking} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {copy.confirming}
              </>
            ) : (
              copy.confirmButton
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
