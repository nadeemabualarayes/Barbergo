import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock, DollarSign, Users, LogOut, Scissors, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  services: Array<{ name: string; duration: number; price: number }>;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
}

interface BarberProfile {
  id: string;
  name: string;
  email: string;
  specialties: string[];
}

export function BarberDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayAppointments: 0,
    completedToday: 0,
    upcomingToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load barber profile
      const barberProfile = {
        id: user.id,
        name: user.user_metadata?.name || 'Barber',
        email: user.email || '',
        specialties: user.user_metadata?.specialties || [],
      };
      setProfile(barberProfile);

      // Load today's appointments
      // In production, this would fetch from the API
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Mock data for demonstration - replace with actual API call
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          customerName: 'John Doe',
          customerPhone: '+1 555-0101',
          services: [{ name: 'Haircut & Fade', duration: 45, price: 35 }],
          date: today,
          startTime: '09:00',
          endTime: '09:45',
          status: 'completed',
          totalPrice: 35,
        },
        {
          id: '2',
          customerName: 'Mike Smith',
          customerPhone: '+1 555-0102',
          services: [
            { name: 'Beard Trim', duration: 20, price: 15 },
            { name: 'Hair Styling', duration: 25, price: 25 },
          ],
          date: today,
          startTime: '10:00',
          endTime: '10:45',
          status: 'confirmed',
          totalPrice: 40,
        },
        {
          id: '3',
          customerName: 'David Johnson',
          customerPhone: '+1 555-0103',
          services: [{ name: 'Full Grooming Package', duration: 90, price: 75 }],
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          status: 'confirmed',
          totalPrice: 75,
        },
      ];

      setTodayAppointments(mockAppointments);

      // Calculate stats
      const completed = mockAppointments.filter(a => a.status === 'completed');
      const upcoming = mockAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
      
      setStats({
        todayEarnings: completed.reduce((sum, a) => sum + a.totalPrice, 0),
        todayAppointments: mockAppointments.length,
        completedToday: completed.length,
        upcomingToday: upcoming.length,
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = (appointmentId: string) => {
    setTodayAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
      )
    );
    loadDashboardData(); // Refresh stats
  };

  const handleMarkNoShow = (appointmentId: string) => {
    setTodayAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'no-show' } : apt
      )
    );
    loadDashboardData(); // Refresh stats
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/barber/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Barber Portal</h1>
              <p className="text-sm text-slate-600">{profile?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Today's Earnings</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.todayEarnings}</div>
              <p className="text-xs text-slate-600 mt-1">From completed appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Appointments</CardTitle>
              <Calendar className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-slate-600 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-slate-600 mt-1">Finished today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
              <Clock className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingToday}</div>
              <p className="text-xs text-slate-600 mt-1">Remaining today</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Queue</CardTitle>
            <CardDescription>Manage your appointments for {format(new Date(), 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{appointment.customerName}</h4>
                          <p className="text-sm text-slate-600">{appointment.customerPhone}</p>
                        </div>
                      </div>
                      
                      <div className="ml-13 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        
                        <div className="text-sm text-slate-700">
                          <span className="font-medium">Services: </span>
                          {appointment.services.map(s => s.name).join(', ')}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-green-700">
                            ${appointment.totalPrice}
                          </span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {appointment.status === 'confirmed' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleMarkCompleted(appointment.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleMarkNoShow(appointment.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          No-Show
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          <button 
            className="flex flex-col items-center py-2 text-red-600"
            onClick={() => navigate('/barber/dashboard')}
          >
            <Scissors className="w-5 h-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-slate-600"
            onClick={() => navigate('/barber/schedule')}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Schedule</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-slate-600"
            onClick={() => navigate('/barber/earnings')}
          >
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="text-xs">Earnings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
