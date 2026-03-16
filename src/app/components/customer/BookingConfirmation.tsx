import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Calendar, Clock, User, Scissors, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function BookingConfirmation() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (!data) {
      navigate('/customer/book');
      return;
    }
    setBookingData(JSON.parse(data));
  }, []);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const totalDuration = bookingData.services.reduce((sum: number, s: any) => sum + s.duration, 0);
      const totalPrice = bookingData.services.reduce((sum: number, s: any) => sum + s.price, 0);

      // Calculate end time
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      const endMinutes = minutes + totalDuration;
      const endHours = hours + Math.floor(endMinutes / 60);
      const endTime = `${endHours.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

      const appointmentData = {
        customerId: user.id,
        customerName: user.user_metadata?.name || 'Customer',
        customerPhone: user.user_metadata?.phone || '',
        customerEmail: user.email || '',
        barberId: bookingData.barber.id === 'any' ? 'any' : bookingData.barber.id,
        barberName: bookingData.barber.name,
        services: bookingData.services.map((s: any) => ({
          id: s.id,
          name: s.name,
          duration: s.duration,
          price: s.price,
          category: s.category,
        })),
        date: bookingData.date,
        startTime: bookingData.time,
        endTime: endTime,
        totalDuration,
        totalPrice,
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      // Clear booking data
      sessionStorage.removeItem('bookingServices');
      sessionStorage.removeItem('bookingBarber');
      sessionStorage.removeItem('bookingData');

      setSuccess(true);
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-600 mb-6">
              Your appointment has been successfully booked. We'll send you a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/customer/appointments')}
              >
                View My Appointments
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/customer/home')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDuration = bookingData.services.reduce((sum: number, s: any) => sum + s.duration, 0);
  const totalPrice = bookingData.services.reduce((sum: number, s: any) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/book/select-time')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Confirm Booking</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Booking Details */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Appointment Details</h2>
            </div>

            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">Date & Time</p>
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

              {/* Barber */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">Barber</p>
                  <p className="font-semibold text-slate-900">{bookingData.barber.name}</p>
                </div>
              </div>

              {/* Services */}
              <div className="flex items-start gap-3">
                <Scissors className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">Services</p>
                  <div className="space-y-2">
                    {bookingData.services.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{service.name}</p>
                          <p className="text-sm text-slate-600">{service.duration} minutes</p>
                        </div>
                        <p className="font-semibold text-green-700">${service.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration & Price */}
              <div className="flex items-start gap-3 pt-4 border-t">
                <DollarSign className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">Total Duration</p>
                    <p className="font-semibold text-slate-900">{totalDuration} minutes</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Total Price</p>
                    <p className="text-2xl font-bold text-green-700">${totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              <strong>Cancellation Policy:</strong> Please cancel at least 24 hours in advance to avoid a cancellation fee.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
