import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../i18n';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { locale } = useI18n();

  const copy =
    locale === 'ar'
      ? {
          title: 'إدارة باربر جو',
          description: 'سجل الدخول لإدارة نشاطك',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          demo: 'للتجربة: استخدم أي بريد إلكتروني وكلمة مرور',
          signIn: 'تسجيل الدخول',
          signingIn: 'جار تسجيل الدخول...',
          success: 'تم تسجيل الدخول بنجاح!',
        }
      : {
          title: 'BarberGo Admin',
          description: 'Sign in to manage your grooming business',
          email: 'Email',
          password: 'Password',
          demo: 'Demo: Use any email and password to login',
          signIn: 'Sign In',
          signingIn: 'Signing in...',
          success: 'Login successful!',
        };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('barbergo_auth', 'true');
      toast.success(copy.success);
      navigate('/admin');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <Card className="w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{copy.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@barbergo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{copy.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? copy.signingIn : copy.signIn}
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4">{copy.demo}</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
