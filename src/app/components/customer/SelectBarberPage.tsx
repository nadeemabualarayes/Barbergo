import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  working_hours: any[];
}

export function SelectBarberPage() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  useEffect(() => {
    // Load selected services from previous step
    const servicesData = sessionStorage.getItem('bookingServices');
    if (!servicesData) {
      navigate('/customer/book');
      return;
    }
    setSelectedServices(JSON.parse(servicesData));
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/barbers`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error('Error loading barbers:', error);
      // Demo data
      setBarbers([
        {
          id: '1',
          name: 'Mohammed Al-Rashid',
          email: 'mohammed@barbergo.com',
          phone: '+966 50 123 4567',
          specialties: ['Barbering', 'Cupping'],
          rating: 4.8,
          working_hours: [],
        },
        {
          id: '2',
          name: 'Youssef Ibrahim',
          email: 'youssef@barbergo.com',
          phone: '+966 55 987 6543',
          specialties: ['Barbering', 'Skin Care'],
          rating: 4.9,
          working_hours: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedBarber) {
      alert('Please select a barber');
      return;
    }
    sessionStorage.setItem('bookingBarber', JSON.stringify(selectedBarber));
    navigate('/customer/book/select-time');
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'Barbering': return 'bg-blue-100 text-blue-800';
      case 'Cupping': return 'bg-purple-100 text-purple-800';
      case 'Skin Care': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/book')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Choose Your Barber</h1>
            <p className="text-xs text-slate-600">Step 2 of 3</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Any Available Option */}
        <Card
          className={`cursor-pointer transition-all ${
            selectedBarber?.id === 'any' ? 'ring-2 ring-red-600 bg-red-50' : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedBarber({ id: 'any', name: 'Any Available Barber', email: '', phone: '', specialties: [], rating: 5, working_hours: [] })}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedBarber?.id === 'any' ? 'bg-red-600 border-red-600' : 'border-gray-300'
              }`}>
                {selectedBarber?.id === 'any' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Any Available Barber</h3>
                <p className="text-sm text-slate-600">First available barber will serve you</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-2">
          <span className="text-sm text-slate-500">OR</span>
        </div>

        {/* Barber List */}
        {barbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-all ${
              selectedBarber?.id === barber.id ? 'ring-2 ring-red-600 bg-red-50' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedBarber(barber)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                  selectedBarber?.id === barber.id ? 'bg-red-600 border-red-600' : 'border-gray-300'
                }`}>
                  {selectedBarber?.id === barber.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {barber.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{barber.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{barber.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {barber.specialties.map((specialty) => (
                      <Badge key={specialty} className={`text-xs ${getSpecialtyColor(specialty)}`}>
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Fixed Bottom Bar */}
      {selectedBarber && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Selected Barber</p>
                <p className="font-semibold text-slate-900">{selectedBarber.name}</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
