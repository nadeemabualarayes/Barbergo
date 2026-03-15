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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Plus, Search, Star, DollarSign, Clock, Trash2, Edit } from 'lucide-react';
import { getBarbers, createBarber, updateBarber, deleteBarber } from '../lib/api';
import { toast } from 'sonner';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPECIALTIES = [
  { id: 'barbering', label: 'Barbering', color: 'bg-blue-100 text-blue-800' },
  { id: 'hajama', label: 'Hajama/Cupping', color: 'bg-purple-100 text-purple-800' },
  { id: 'skincare', label: 'Skin Care', color: 'bg-green-100 text-green-800' },
];

export function Barbers() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    commission_rate: 50,
    working_hours: DAYS_OF_WEEK.map(day => ({
      day,
      start: '09:00',
      end: '18:00',
      is_working: day !== 'Sunday',
    })),
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await getBarbers();
      setBarbers(data);
    } catch (error) {
      console.error('Error loading barbers:', error);
      // Set demo data
      setBarbers([
        {
          id: '1',
          name: 'Mohammed Al-Rashid',
          email: 'mohammed@barbergo.com',
          phone: '+966 50 123 4567',
          specialties: ['barbering', 'hajama'],
          rating: 4.8,
          commission_rate: 50,
          avatar_url: null,
          working_hours: DAYS_OF_WEEK.map(day => ({
            day,
            start: '09:00',
            end: '18:00',
            is_working: day !== 'Sunday',
          })),
        },
        {
          id: '2',
          name: 'Youssef Ibrahim',
          email: 'youssef@barbergo.com',
          phone: '+966 55 987 6543',
          specialties: ['barbering', 'skincare'],
          rating: 4.9,
          commission_rate: 55,
          avatar_url: null,
          working_hours: DAYS_OF_WEEK.map(day => ({
            day,
            start: '14:00',
            end: '22:00',
            is_working: day !== 'Friday',
          })),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        await updateBarber(editingBarber.id, formData);
        toast.success('Barber updated successfully!');
      } else {
        await createBarber({ ...formData, rating: 5.0 });
        toast.success('Barber created successfully!');
      }
      setDialogOpen(false);
      resetForm();
      loadBarbers();
    } catch (error) {
      console.error('Error saving barber:', error);
      toast.error('Failed to save barber');
    }
  };

  const handleEdit = (barber: any) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      specialties: barber.specialties,
      commission_rate: barber.commission_rate,
      working_hours: barber.working_hours,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (barberId: string) => {
    if (confirm('Are you sure you want to delete this barber?')) {
      try {
        await deleteBarber(barberId);
        toast.success('Barber deleted successfully!');
        loadBarbers();
      } catch (error) {
        console.error('Error deleting barber:', error);
        toast.error('Failed to delete barber');
      }
    }
  };

  const resetForm = () => {
    setEditingBarber(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: [],
      commission_rate: 50,
      working_hours: DAYS_OF_WEEK.map(day => ({
        day,
        start: '09:00',
        end: '18:00',
        is_working: day !== 'Sunday',
      })),
    });
  };

  const filteredBarbers = barbers.filter(barber =>
    barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading barbers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Barbers & Staff</h1>
          <p className="text-gray-600 mt-1">Manage your team and their schedules</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Barber
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBarber ? 'Edit Barber' : 'Add New Barber'}</DialogTitle>
              <DialogDescription>
                {editingBarber ? 'Update barber information and schedule' : 'Add a new staff member to your team'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="specialties">Specialties</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commission">Commission Rate (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.commission_rate}
                        onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specialties" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Select Specialties *</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {SPECIALTIES.map((specialty) => (
                        <label
                          key={specialty.id}
                          className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, specialties: [...formData.specialties, specialty.id] });
                              } else {
                                setFormData({ ...formData, specialties: formData.specialties.filter(s => s !== specialty.id) });
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{specialty.label}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <Label>Working Hours</Label>
                    {formData.working_hours.map((schedule, index) => (
                      <div key={schedule.day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-28">
                          <p className="font-medium text-sm">{schedule.day}</p>
                        </div>
                        <Switch
                          checked={schedule.is_working}
                          onCheckedChange={(checked) => {
                            const newHours = [...formData.working_hours];
                            newHours[index].is_working = checked;
                            setFormData({ ...formData, working_hours: newHours });
                          }}
                        />
                        {schedule.is_working && (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={schedule.start}
                              onChange={(e) => {
                                const newHours = [...formData.working_hours];
                                newHours[index].start = e.target.value;
                                setFormData({ ...formData, working_hours: newHours });
                              }}
                              className="w-32"
                            />
                            <span className="text-gray-500">to</span>
                            <Input
                              type="time"
                              value={schedule.end}
                              onChange={(e) => {
                                const newHours = [...formData.working_hours];
                                newHours[index].end = e.target.value;
                                setFormData({ ...formData, working_hours: newHours });
                              }}
                              className="w-32"
                            />
                          </div>
                        )}
                        {!schedule.is_working && (
                          <span className="text-gray-500 text-sm">Day Off</span>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 justify-end pt-4 mt-4 border-t">
                <Button type="button" variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBarber ? 'Update Barber' : 'Add Barber'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search barbers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No barbers found</p>
          </div>
        ) : (
          filteredBarbers.map((barber) => (
            <Card key={barber.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {barber.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{barber.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{barber.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{barber.email}</p>
                  <p className="text-gray-600">{barber.phone}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty: string) => {
                      const specialtyInfo = SPECIALTIES.find(s => s.id === specialty);
                      return (
                        <Badge key={specialty} className={specialtyInfo?.color || ''}>
                          {specialtyInfo?.label || specialty}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Commission: {barber.commission_rate}%</span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Working Hours:
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {barber.working_hours.filter((wh: any) => wh.is_working).map((wh: any) => (
                      <div key={wh.day} className="flex justify-between">
                        <span>{wh.day}:</span>
                        <span>{wh.start} - {wh.end}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(barber)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(barber.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
