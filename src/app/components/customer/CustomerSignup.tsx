import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, Scissors } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useI18n } from '../../i18n';
import { LanguageToggle } from '../LanguageToggle';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CustomerSignup() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const copy =
    locale === 'ar'
      ? {
          title: 'إنشاء حساب',
          description: 'انضم إلى باربر جو لحجز خدماتك',
          fullName: 'الاسم الكامل',
          email: 'البريد الإلكتروني',
          phone: 'رقم الهاتف',
          password: 'كلمة المرور',
          confirmPassword: 'تأكيد كلمة المرور',
          createAccount: 'إنشاء حساب',
          creatingAccount: 'جار إنشاء الحساب...',
          already: 'لديك حساب بالفعل؟',
          signIn: 'تسجيل الدخول',
          mismatch: 'كلمتا المرور غير متطابقتين',
          minPassword: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
          failedProfile: 'فشل إنشاء ملف العميل',
          failedCreate: 'فشل إنشاء الحساب',
        }
      : {
          title: 'Create Account',
          description: 'Join BarberGo to book your grooming services',
          fullName: 'Full Name',
          email: 'Email',
          phone: 'Phone Number',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          createAccount: 'Create Account',
          creatingAccount: 'Creating account...',
          already: 'Already have an account?',
          signIn: 'Sign in',
          mismatch: 'Passwords do not match',
          minPassword: 'Password must be at least 6 characters',
          failedProfile: 'Failed to create customer profile',
          failedCreate: 'Failed to create account',
        };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(copy.mismatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(copy.minPassword);
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            role: 'customer',
          },
        },
      });

      if (signUpError) throw signUpError;

      const customerData = {
        id: authData.user?.id || `customer_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        totalVisits: 0,
        totalSpent: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        let errorMessage = copy.failedProfile;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || `API Error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      navigate('/customer/home');
    } catch (err: any) {
      setError(err.message || copy.failedCreate);
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
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">{copy.fullName}</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{copy.email}</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{copy.phone}</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+970 00 000 0000" value={formData.phone} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{copy.password}</Label>
                <Input id="password" name="password" type="password" placeholder="********" value={formData.password} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{copy.confirmPassword}</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.creatingAccount}
                  </>
                ) : (
                  copy.createAccount
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {copy.already}{' '}
                <Link to="/customer/login" className="text-red-600 hover:underline font-medium">
                  {copy.signIn}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
