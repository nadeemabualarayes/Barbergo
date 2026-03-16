import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Scissors,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getAppointments, getAnalytics } from '../lib/api';
import { format } from 'date-fns';

export function Dashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
    activeBarbers: 0,
    completionRate: 0,
    upcomingAppointments: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const appointments = await getAppointments({ date: today });
      const analytics = await getAnalytics({
        start_date: today,
        end_date: today,
      });

      const todayRevenue = appointments
        .filter((apt: any) => apt.status === 'completed')
        .reduce((sum: number, apt: any) => sum + (apt.total_price || apt.totalPrice || 0), 0);

      const completedCount = appointments.filter((apt: any) => apt.status === 'completed').length;
      const completionRate = appointments.length > 0 
        ? (completedCount / appointments.length) * 100 
        : 0;

      const upcoming = appointments
        .filter((apt: any) => apt.status === 'pending' || apt.status === 'confirmed')
        .sort((a: any, b: any) => {
          const parseDate = (apt: any) => {
            const raw = apt.start_time || apt.startTime;
            if (!raw) return new Date(0);
            let d = new Date(raw);
            if (isNaN(d.getTime())) d = new Date(`${apt.date}T${raw}`);
            return isNaN(d.getTime()) ? new Date(0) : d;
          };
          return parseDate(a).getTime() - parseDate(b).getTime();
        })
        .slice(0, 5);

      setStats({
        todayAppointments: appointments.length,
        todayRevenue,
        activeBarbers: analytics.active_barbers || 0,
        completionRate: Math.round(completionRate),
        upcomingAppointments: upcoming,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set demo data
      setStats({
        todayAppointments: 12,
        todayRevenue: 485,
        activeBarbers: 4,
        completionRate: 87,
        upcomingAppointments: [
          {
            id: '1',
            customer_name: 'Ahmed Ali',
            barber_name: 'Mohammed',
            service_titles: ['Haircut', 'Beard Trim'],
            start_time: new Date().toISOString(),
            total_price: 45,
            status: 'confirmed'
          },
          {
            id: '2',
            customer_name: 'Omar Hassan',
            barber_name: 'Youssef',
            service_titles: ['Hajama'],
            start_time: new Date(Date.now() + 30 * 60000).toISOString(),
            total_price: 60,
            status: 'pending'
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today\'s Revenue',
      value: `$${stats.todayRevenue}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Barbers',
      value: stats.activeBarbers,
      icon: Scissors,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {stats.upcomingAppointments.map((appointment) => {
                const customerName = appointment.customer_name || appointment.customerName || 'Customer';
                const barberName = appointment.barber_name || appointment.barberName || 'Barber';
                const serviceTitles = appointment.service_titles || appointment.serviceTitles || (appointment.services?.map((s: any) => s.title || s.name) || []);
                const totalPrice = appointment.total_price || appointment.totalPrice || 0;
                
                let formattedTime = 'TBD';
                try {
                  const raw = appointment.start_time || appointment.startTime;
                  if (raw) {
                    let d = new Date(raw);
                    if (isNaN(d.getTime())) d = new Date(`${appointment.date}T${raw}`);
                    if (!isNaN(d.getTime())) formattedTime = format(d, 'h:mm a');
                  }
                } catch (e) {}

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {customerName.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{customerName}</p>
                        <p className="text-sm text-gray-600">
                          {serviceTitles.join(', ')} • {barberName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formattedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        ${totalPrice}
                      </span>
                      {getStatusIcon(appointment.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">New Appointment</h3>
            <p className="text-sm text-gray-600">Book a new appointment</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Barbers</h3>
            <p className="text-sm text-gray-600">View and edit staff</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Scissors className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Services</h3>
            <p className="text-sm text-gray-600">Manage service catalog</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
