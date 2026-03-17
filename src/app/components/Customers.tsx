import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { getCustomers } from '../lib/api';

export function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      // Set demo data
      setCustomers([
        {
          id: '1',
          name: 'Ahmed Ali',
          email: 'ahmed.ali@email.com',
          phone: '+966 50 123 4567',
          total_visits: 12,
          total_spent: 540,
          last_visit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Omar Hassan',
          email: 'omar.hassan@email.com',
          phone: '+966 55 987 6543',
          total_visits: 8,
          total_spent: 320,
          last_visit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Khalid Ibrahim',
          email: 'khalid.ibrahim@email.com',
          phone: '+966 54 234 5678',
          total_visits: 15,
          total_spent: 675,
          last_visit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Fahad Mohammed',
          email: 'fahad.mohammed@email.com',
          phone: '+966 56 345 6789',
          total_visits: 5,
          total_spent: 200,
          last_visit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 500) return { label: 'VIP', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 250) return { label: 'Gold', color: 'bg-purple-100 text-purple-800' };
    return { label: 'Regular', color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return <div className="text-center py-12">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">View and manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.filter(c => c.total_spent >= 500).length}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">VIP</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₪{customers.reduce((sum, c) => sum + c.total_spent, 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Visits</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.length > 0 
                    ? Math.round(customers.reduce((sum, c) => sum + c.total_visits, 0) / customers.length)
                    : 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No customers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Visits</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Total Spent</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Tier</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.total_spent);
                    return (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">{customer.email}</p>
                          <p className="text-xs text-gray-600">{customer.phone}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-gray-900">{customer.total_visits}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-green-700">₪{customer.total_spent}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={tier.color}>{tier.label}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-gray-600">
                          {formatDate(customer.last_visit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
