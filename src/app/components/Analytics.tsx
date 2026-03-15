import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { getAnalytics } from '../lib/api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set demo data
      setAnalytics({
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
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${analytics.total_revenue}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                +{analytics.revenue_growth}% from last period
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
            <p className="text-3xl font-bold text-gray-900">{analytics.total_appointments}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                +{analytics.appointment_growth}% from last period
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
            <p className="text-3xl font-bold text-gray-900">{analytics.total_customers}</p>
            <p className="text-sm text-gray-600 mt-2">Active customer base</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Avg. Appointment Value</p>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${analytics.avg_appointment_value}</p>
            <p className="text-sm text-gray-600 mt-2">Per booking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Appointments (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenue_by_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.revenue_by_service}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.revenue_by_service.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Barber Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Barbers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.top_barbers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
              <Bar dataKey="appointments" fill="#8B5CF6" name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Barber Commissions Table */}
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
                {analytics.top_barbers.map((barber: any) => (
                  <tr key={barber.name} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {barber.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{barber.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">{barber.appointments}</td>
                    <td className="py-4 px-4 text-center font-semibold text-green-700">${barber.revenue}</td>
                    <td className="py-4 px-4 text-center font-semibold text-blue-700">${barber.commission}</td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-900">
                      ${barber.revenue - barber.commission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
