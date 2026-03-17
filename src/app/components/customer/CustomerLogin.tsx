import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, Scissors } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../i18n';
import { LanguageToggle } from '../LanguageToggle';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { locale } = useI18n();

  const copy =
    locale === 'ar'
      ? {
          title: 'أهلا بك في باربر جو',
          description: 'سجل الدخول لحجز موعدك القادم',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          signIn: 'تسجيل الدخول',
          signingIn: 'جار تسجيل الدخول...',
          noAccount: 'ليس لديك حساب؟',
          signUp: 'إنشاء حساب',
          invalid: 'بيانات الدخول غير صحيحة. هذه البوابة مخصصة للعملاء فقط.',
          failed: 'فشل تسجيل الدخول',
        }
      : {
          title: 'Welcome to BarberGo',
          description: 'Sign in to book your next grooming appointment',
          email: 'Email',
          password: 'Password',
          signIn: 'Sign In',
          signingIn: 'Signing in...',
          noAccount: "Don't have an account?",
          signUp: 'Sign up',
          invalid: 'Invalid credentials. This portal is for customers only.',
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
      if (userRole !== 'customer') {
        await supabase.auth.signOut();
        throw new Error(copy.invalid);
      }

      navigate('/customer/home');
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
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
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
              <p className="text-sm text-center text-muted-foreground">
                {copy.noAccount}{' '}
                <Link to="/customer/signup" className="text-red-600 hover:underline font-medium">
                  {copy.signUp}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
