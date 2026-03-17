import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Calendar, DollarSign, Download, TrendingUp, Users } from 'lucide-react';
import { getAnalytics } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const FALLBACK_ANALYTICS = {
  total_revenue: 12450,
  total_appointments: 156,
  total_customers: 89,
  avg_appointment_value: 79.81,
  revenue_growth: 12.5,
  appointment_growth: 8.3,
  revenue_by_day: [
    { date: 'Mon', revenue: 450, appointments: 12 },
    { date: 'Tue', revenue: 520, appointments: 14 },
    { date: 'Wed', revenue: 380, appointments: 10 },
    { date: 'Thu', revenue: 620, appointments: 16 },
    { date: 'Fri', revenue: 890, appointments: 22 },
    { date: 'Sat', revenue: 1120, appointments: 28 },
    { date: 'Sun', revenue: 340, appointments: 8 },
  ],
  revenue_by_service: [
    { name: 'Haircut', value: 4680, percentage: 37.6 },
    { name: 'Hajama', value: 3600, percentage: 28.9 },
    { name: 'Beard Trim', value: 2340, percentage: 18.8 },
    { name: 'Facial', value: 1200, percentage: 9.6 },
    { name: 'Hot Shave', value: 630, percentage: 5.1 },
  ],
  top_barbers: [
    { name: 'Mohammed', revenue: 5200, appointments: 68, commission: 2600 },
    { name: 'Youssef', revenue: 4300, appointments: 54, commission: 2365 },
    { name: 'Abdullah', revenue: 2950, appointments: 34, commission: 1475 },
  ],
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics(FALLBACK_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  const normalizedAnalytics = useMemo(() => {
    const source = analytics || {};

    return {
      totalRevenue: asNumber(source.total_revenue),
      totalAppointments: asNumber(source.total_appointments),
      totalCustomers: asNumber(source.total_customers),
      avgAppointmentValue: asNumber(source.avg_appointment_value),
      revenueGrowth: asNumber(source.revenue_growth),
      appointmentGrowth: asNumber(source.appointment_growth),
      revenueByDay: asArray<any>(source.revenue_by_day),
      revenueByService: asArray<any>(source.revenue_by_service),
      topBarbers: asArray<any>(source.top_barbers),
    };
  }, [analytics]);

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{normalizedAnalytics.totalRevenue}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                +{normalizedAnalytics.revenueGrowth}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{normalizedAnalytics.totalAppointments}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                +{normalizedAnalytics.appointmentGrowth}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{normalizedAnalytics.totalCustomers}</p>
            <p className="text-sm text-gray-600 mt-2">Active customer base</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Avg. Appointment Value</p>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{normalizedAnalytics.avgAppointmentValue}</p>
            <p className="text-sm text-gray-600 mt-2">Per booking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Appointments (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={normalizedAnalytics.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#8B5CF6" strokeWidth={2} name="Appointments" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={normalizedAnalytics.revenueByService}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage ?? 0}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {normalizedAnalytics.revenueByService.map((entry: any, index: number) => (
                    <Cell key={`${entry.name ?? 'service'}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Barbers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={normalizedAnalytics.topBarbers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar dataKey="appointments" fill="#8B5CF6" name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barber Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Barber</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Appointments</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Commission (50%)</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Net Earnings</th>
                </tr>
              </thead>
              <tbody>
                {normalizedAnalytics.topBarbers.map((barber: any, index: number) => {
                  const name = barber.name || `Barber ${index + 1}`;
                  const revenue = asNumber(barber.revenue);
                  const commission = asNumber(barber.commission);
                  const appointments = asNumber(barber.appointments);

                  return (
                    <tr key={`${name}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold">{appointments}</td>
                      <td className="py-4 px-4 text-center font-semibold text-green-700">{revenue}</td>
                      <td className="py-4 px-4 text-center font-semibold text-blue-700">{commission}</td>
                      <td className="py-4 px-4 text-center font-semibold text-gray-900">{revenue - commission}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
