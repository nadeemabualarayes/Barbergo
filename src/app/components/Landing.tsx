import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Scissors, Users, UserCog, Shield } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">BarberGo</h1>
              <p className="text-slate-400 text-sm">Premium Men's Grooming Services</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Welcome to BarberGo
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your complete business management system for barbering, cupping (hajama), 
            and skin care services
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Customer Portal */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-red-600 transition-all hover:shadow-xl hover:shadow-red-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Customer Portal</CardTitle>
              <CardDescription className="text-slate-400">
                Book appointments and manage your grooming sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/customer/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate('/customer/signup')}
              >
                Create Account
              </Button>
            </CardContent>
          </Card>

          {/* Barber Portal */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-600 transition-all hover:shadow-xl hover:shadow-blue-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Barber Portal</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your daily queue and track earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/barber/login')}
              >
                Staff Login
              </Button>
              <p className="text-xs text-center text-slate-500">
                Credentials provided by admin
              </p>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-green-600 transition-all hover:shadow-xl hover:shadow-green-600/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-slate-400">
                Full business management and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/login')}
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <Scissors className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Barbering</h4>
              <p className="text-slate-400 text-sm">
                Professional haircuts, fades, and styling services
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="w-10 h-10 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-xl">☪</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Cupping (Hajama)</h4>
              <p className="text-slate-400 text-sm">
                Traditional therapeutic treatment for wellness
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700">
              <Users className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Skin Care</h4>
              <p className="text-slate-400 text-sm">
                Premium facial treatments and grooming care
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-slate-500 text-sm">
            © 2026 BarberGo - Comprehensive Business Management System
          </p>
        </div>
      </footer>
    </div>
  );
}
