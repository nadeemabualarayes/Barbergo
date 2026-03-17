import { useState } from 'react';
import { Loader2, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../i18n';
import { LanguageToggle } from '../LanguageToggle';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function BarberLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { locale } = useI18n();

  const copy =
    locale === 'ar'
      ? {
          title: 'بوابة الحلاقين',
          description: 'سجل الدخول لإدارة مواعيدك وجدولك',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          help: 'بيانات الدخول يوفرها المدير. تواصل مع الإدارة إذا لم يكن لديك وصول.',
          signIn: 'تسجيل الدخول',
          signingIn: 'جار تسجيل الدخول...',
          invalid: 'بيانات الدخول غير صحيحة. هذه البوابة مخصصة للحلاقين فقط.',
          failed: 'فشل تسجيل الدخول',
        }
      : {
          title: 'Barber Portal',
          description: 'Sign in to manage your appointments and schedule',
          email: 'Email',
          password: 'Password',
          help: "Your credentials are provided by the admin. Contact your manager if you don't have access.",
          signIn: 'Sign In',
          signingIn: 'Signing in...',
          invalid: 'Invalid credentials. This portal is for barbers only.',
          failed: 'Failed to login',
        };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const userRole = data.user?.user_metadata?.role;
      if (userRole !== 'barber') {
        await supabase.auth.signOut();
        throw new Error(copy.invalid);
      }

      navigate('/barber/dashboard');
    } catch (err: any) {
      setError(err.message || copy.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <Scissors className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{copy.email}</Label>
                <Input id="email" type="email" placeholder="barber@barbergo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{copy.password}</Label>
                <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              </div>
              <p className="text-xs text-muted-foreground">{copy.help}</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.signingIn}
                  </>
                ) : (
                  copy.signIn
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
