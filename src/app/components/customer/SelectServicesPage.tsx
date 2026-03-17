import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ArrowLeft, Clock, DollarSign, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

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
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/services`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      const activeServices = data.filter((s: any) => s.is_active);
      setServices(activeServices);
    } catch (error) {
      console.error('Error loading services:', error);
      // Demo data
      setServices([
        {
          id: '1',
          title: 'Classic Haircut',
          category: 'Barbering',
          duration_minutes: 30,
          price: 35,
          description: 'Traditional haircut with styling',
          is_active: true,
        },
        {
          id: '2',
          title: 'Fade & Haircut',
          category: 'Barbering',
          duration_minutes: 45,
          price: 45,
          description: 'Modern fade with haircut',
          is_active: true,
        },
        {
          id: '3',
          title: 'Beard Trim',
          category: 'Barbering',
          duration_minutes: 20,
          price: 20,
          description: 'Professional beard shaping and trim',
          is_active: true,
        },
        {
          id: '4',
          title: 'Cupping Therapy',
          category: 'Cupping',
          duration_minutes: 60,
          price: 80,
          description: 'Traditional hijama cupping treatment',
          is_active: true,
        },
        {
          id: '5',
          title: 'Facial Treatment',
          category: 'Skin Care',
          duration_minutes: 45,
          price: 60,
          description: 'Deep cleansing facial',
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    // Store selected services in sessionStorage
    sessionStorage.setItem('bookingServices', JSON.stringify(selectedServices));
    navigate('/customer/book/select-barber');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Barbering': return 'bg-blue-100 text-blue-800';
      case 'Cupping': return 'bg-purple-100 text-purple-800';
      case 'Skin Care': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Select Services</h1>
            <p className="text-xs text-slate-600">Step 1 of 3</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">{category}</h2>
            <div className="grid gap-4">
              {categoryServices.map((service) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
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
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900">{service.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center text-sm text-slate-700">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.duration_minutes} min
                                </span>
                                 <span className="flex items-center text-sm font-semibold text-green-700">
                                  ₪{service.price}
                                </span>
                              </div>
                            </div>
                            <Badge className={getCategoryColor(service.category)}>
                              {service.category}
                            </Badge>
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

      {/* Fixed Bottom Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-600">
                  {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm font-semibold text-slate-900">
                    Total: ₪{totalPrice}
                  </span>
                  <span className="text-sm text-slate-600">
                    {totalDuration} minutes
                  </span>
                </div>
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
