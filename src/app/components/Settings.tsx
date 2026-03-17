import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Save, Bell, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [settings, setSettings] = useState({
    businessName: 'BarberGo Premium',
    businessEmail: 'contact@barbergo.com',
    businessPhone: '+966 50 000 0000',
    address: 'Riyadh, Saudi Arabia',
    currency: 'ILS',
    timezone: 'Asia/Riyadh',
    workingHoursStart: '09:00',
    workingHoursEnd: '22:00',
    bufferTime: 5,
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      reminderTime: 60,
    },
    booking: {
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0,
      cancellationWindow: 24,
      autoConfirm: false,
    },
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your business settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={settings.businessPhone}
                    onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Default Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.workingHoursStart}
                    onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workingHoursEnd}
                    onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Buffer Time Between Appointments (minutes)</Label>
                <Input
                  id="bufferTime"
                  type="number"
                  min="0"
                  value={settings.bufferTime}
                  onChange={(e) => setSettings({ ...settings, bufferTime: Number(e.target.value) })}
                />
                <p className="text-sm text-gray-500">
                  Extra time added between appointments for cleaning and preparation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Send SMS to customers</p>
                </div>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Send automatic reminders to customers</p>
                </div>
                <Switch
                  checked={settings.notifications.appointmentReminders}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, appointmentReminders: checked },
                    })
                  }
                />
              </div>
              {settings.notifications.appointmentReminders && (
                <div className="space-y-2 pl-4 border-l-2 border-blue-500">
                  <Label htmlFor="reminderTime">Reminder Time (minutes before appointment)</Label>
                  <Input
                    id="reminderTime"
                    type="number"
                    min="15"
                    value={settings.notifications.reminderTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, reminderTime: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Rules */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Booking Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Online Booking</p>
                  <p className="text-sm text-gray-500">Let customers book appointments online</p>
                </div>
                <Switch
                  checked={settings.booking.allowOnlineBooking}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      booking: { ...settings.booking, allowOnlineBooking: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Deposit</p>
                  <p className="text-sm text-gray-500">Require upfront payment for bookings</p>
                </div>
                <Switch
                  checked={settings.booking.requireDeposit}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      booking: { ...settings.booking, requireDeposit: checked },
                    })
                  }
                />
              </div>
              {settings.booking.requireDeposit && (
                <div className="space-y-2 pl-4 border-l-2 border-blue-500">
                  <Label htmlFor="depositAmount">Deposit Amount (₪)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    min="0"
                    value={settings.booking.depositAmount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        booking: { ...settings.booking, depositAmount: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                <Input
                  id="cancellationWindow"
                  type="number"
                  min="0"
                  value={settings.booking.cancellationWindow}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      booking: { ...settings.booking, cancellationWindow: Number(e.target.value) },
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  Minimum hours before appointment that customers can cancel
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Confirm Appointments</p>
                  <p className="text-sm text-gray-500">Automatically confirm new bookings</p>
                </div>
                <Switch
                  checked={settings.booking.autoConfirm}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      booking: { ...settings.booking, autoConfirm: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
