import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Calendar, Scissors, User, LogOut, Clock, Star } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export function CustomerHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setProfile({
        name: user.user_metadata?.name || 'Guest',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/customer/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">BarberGo</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.name}!
          </h2>
          <p className="text-slate-600">Ready for your next grooming experience?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/book')}>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>Schedule your next grooming session</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/appointments')}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>View and manage your bookings</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/profile')}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your information</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Service Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Services</CardTitle>
            <CardDescription>Choose from our premium grooming services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg text-white">
                <Scissors className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Barbering</h3>
                <p className="text-sm text-slate-300">Professional haircuts, fades, and styling</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 rounded-lg text-white">
                <Star className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Cupping (Hajama)</h3>
                <p className="text-sm text-red-100">Traditional therapeutic treatment</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white">
                <User className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Skin Care</h3>
                <p className="text-sm text-blue-100">Premium facial treatments and care</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to look your best?</h3>
                <p className="text-red-100">Book an appointment with our expert barbers today</p>
              </div>
              <Button 
                size="lg" 
                variant="secondary" 
                className="mt-4 md:mt-0"
                onClick={() => navigate('/customer/book')}
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button 
            className="flex flex-col items-center py-2 text-red-600"
            onClick={() => navigate('/customer/home')}
          >
            <Scissors className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-slate-600"
            onClick={() => navigate('/customer/book')}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Book</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-slate-600"
            onClick={() => navigate('/customer/appointments')}
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">Appointments</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-slate-600"
            onClick={() => navigate('/customer/profile')}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
