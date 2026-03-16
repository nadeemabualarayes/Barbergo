import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { ArrowLeft, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

export function SelectTimePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);

  useEffect(() => {
    // Load data from previous steps
    const servicesData = sessionStorage.getItem('bookingServices');
    const barberData = sessionStorage.getItem('bookingBarber');
    
    if (!servicesData || !barberData) {
      navigate('/customer/book');
      return;
    }
    
    setSelectedServices(JSON.parse(servicesData));
    setSelectedBarber(JSON.parse(barberData));
  }, []);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedBarber]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      // In production, call the availability API
      // For demo, generate mock slots
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
    // Remove some random slots to simulate booked times
    return slots.filter((_, index) => index % 3 !== 0);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
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

  const totalDuration = selectedServices.reduce((sum: number, s: any) => sum + (s.duration_minutes || s.duration || 0), 0);
  const totalPrice = selectedServices.reduce((sum: number, s: any) => sum + (s.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/book/select-barber')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Select Date & Time</h1>
            <p className="text-xs text-slate-600">Step 3 of 3</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Choose Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        {selectedDate && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">
                Available Times for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">Loading available slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600">No available slots for this date</p>
                  <p className="text-sm text-slate-500 mt-1">Please select a different date</p>
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

        {/* Booking Summary */}
        <Card className="bg-slate-50">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Services</p>
                <p className="font-medium">
                  {selectedServices.map(s => s.title || s.name).join(', ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Barber</p>
                <p className="font-medium">{selectedBarber?.name}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="font-medium">{totalDuration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Price</p>
                  <p className="font-medium text-green-700">${totalPrice}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Bar */}
      {selectedDate && selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Selected Time</p>
                <p className="font-semibold text-slate-900">
                  {format(selectedDate, 'MMM d, yyyy')} at {selectedTime}
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleContinue}>
                Review Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
