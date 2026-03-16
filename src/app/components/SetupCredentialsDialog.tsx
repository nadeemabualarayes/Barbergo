import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { Key, Loader2, Copy, CheckCircle } from 'lucide-react';

interface SetupCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber: any;
}

export function SetupCredentialsDialog({ open, onOpenChange, barber }: SetupCredentialsDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    const length = 12;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
    setConfirmPassword(password);
  };

  const handleSetupCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create Supabase Auth user for the barber
      const { data, error } = await supabase.auth.signUp({
        email: barber.email,
        password: password,
        options: {
          data: {
            name: barber.name,
            phone: barber.phone,
            role: 'barber',
            barber_id: barber.id,
          },
        },
      });

      if (error) throw error;

      setCredentials({
        email: barber.email,
        password: password,
      });

      toast.success('Barber login credentials created successfully!');
    } catch (error: any) {
      console.error('Error setting up credentials:', error);
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. The barber may already have login credentials.');
      } else {
        toast.error(error.message || 'Failed to setup credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (credentials) {
      const text = `BarberGo Login Credentials\n\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nLogin at: ${window.location.origin}/barber/login`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Credentials copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setCredentials(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Setup Barber Login Credentials
          </DialogTitle>
          <DialogDescription>
            Create login credentials for {barber?.name}
          </DialogDescription>
        </DialogHeader>

        {!credentials ? (
          <form onSubmit={handleSetupCredentials} className="space-y-4 mt-4">
            <Alert>
              <AlertDescription>
                This will create a Barber Portal login for <strong>{barber?.name}</strong> using email: <strong>{barber?.email}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  disabled={loading}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="text"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Credentials'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 mt-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Login credentials created successfully! Share these with the barber.
              </AlertDescription>
            </Alert>

            <div className="bg-slate-50 p-4 rounded-lg space-y-3 border">
              <div>
                <Label className="text-xs text-slate-600">Email</Label>
                <p className="font-mono text-sm font-semibold">{credentials.email}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Password</Label>
                <p className="font-mono text-sm font-semibold">{credentials.password}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Login URL</Label>
                <p className="text-sm text-blue-600">{window.location.origin}/barber/login</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={copyCredentials}
                className="flex-1"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Credentials
                  </>
                )}
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
