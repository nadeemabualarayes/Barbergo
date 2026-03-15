import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar, Plus, Search, Filter, Clock, DollarSign } from 'lucide-react';
import { getAppointments, createAppointment, updateAppointment, getBarbers, getServices } from '../lib/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    barber_id: '',
    service_ids: [] as string[],
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, barbersData, servicesData] = await Promise.all([
        getAppointments(),
        getBarbers(),
        getServices(),
      ]);
      setAppointments(appointmentsData);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Set demo data
      setAppointments([
        {
          id: '1',
          customer_name: 'Ahmed Ali',
          customer_phone: '+966 50 123 4567',
          barber_name: 'Mohammed',
          service_titles: ['Haircut', 'Beard Trim'],
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 30 * 60000).toISOString(),
          total_duration: 30,
          total_price: 45,
          status: 'confirmed',
          payment_status: 'paid',
        },
        {
          id: '2',
          customer_name: 'Omar Hassan',
          customer_phone: '+966 55 987 6543',
          barber_name: 'Youssef',
          service_titles: ['Hajama'],
          start_time: new Date(Date.now() + 60 * 60000).toISOString(),
          end_time: new Date(Date.now() + 105 * 60000).toISOString(),
          total_duration: 45,
          total_price: 60,
          status: 'pending',
          payment_status: 'pending',
        },
      ]);
      setBarbers([
        { id: '1', name: 'Mohammed', specialties: ['barbering', 'hajama'] },
        { id: '2', name: 'Youssef', specialties: ['barbering', 'skincare'] },
      ]);
      setServices([
        { id: '1', title: 'Haircut', price: 30, duration_minutes: 30, category: 'barbering' },
        { id: '2', title: 'Beard Trim', price: 15, duration_minutes: 15, category: 'barbering' },
        { id: '3', title: 'Hajama', price: 60, duration_minutes: 45, category: 'hajama' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedServices = services.filter(s => formData.service_ids.includes(s.id));
      const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
      const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
      const barber = barbers.find(b => b.id === formData.barber_id);

      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000);

      const newAppointment = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        barber_id: formData.barber_id,
        barber_name: barber?.name,
        service_ids: formData.service_ids,
        service_titles: selectedServices.map(s => s.title),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        total_duration: totalDuration,
        total_price: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        notes: formData.notes,
      };

      await createAppointment(newAppointment);
      toast.success('Appointment created successfully!');
      setDialogOpen(false);
      loadData();
      setFormData({
        customer_name: '',
        customer_phone: '',
        barber_id: '',
        service_ids: [],
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      toast.success('Appointment status updated!');
      loadData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.barber_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and track all bookings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
              <DialogDescription>Book a new appointment for a customer</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barber">Select Barber *</Label>
                <Select value={formData.barber_id} onValueChange={(value) => setFormData({ ...formData, barber_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a barber" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Services *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.service_ids.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, service_ids: [...formData.service_ids, service.id] });
                          } else {
                            setFormData({ ...formData, service_ids: formData.service_ids.filter(id => id !== service.id) });
                          }
                        }}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{service.title}</p>
                        <p className="text-xs text-gray-600">${service.price} • {service.duration_minutes}min</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer or barber name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {appointment.customer_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.customer_name}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{appointment.customer_phone}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(appointment.start_time), 'MMM dd, yyyy')} at {format(new Date(appointment.start_time), 'h:mm a')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.total_duration} mins
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${appointment.total_price}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Barber:</span> {appointment.barber_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Services:</span> {appointment.service_titles.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment.id, value)}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="justify-center">
                      {appointment.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
