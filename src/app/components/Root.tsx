import { Outlet, NavLink, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Briefcase, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useI18n } from '../i18n';
import { LanguageToggle } from './LanguageToggle';

export function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { direction, locale, t } = useI18n();
  const adminUser = locale === 'ar' ? 'مستخدم الإدارة' : 'Admin User';
  const subtitle = locale === 'ar' ? 'أدر نشاطك بكفاءة' : 'Manage your grooming business efficiently';

  const navigation = [
    { name: t('nav.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('nav.appointments'), href: '/admin/appointments', icon: Calendar },
    { name: t('nav.barbers'), href: '/admin/barbers', icon: Scissors },
    { name: t('nav.services'), href: '/admin/services', icon: Briefcase },
    { name: t('nav.customers'), href: '/admin/customers', icon: Users },
    { name: t('nav.analytics'), href: '/admin/analytics', icon: BarChart3 },
    { name: t('nav.settings'), href: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    // Check if user is authenticated (you can expand this later)
    const isAuthenticated = localStorage.getItem('barbergo_auth');
    if (!isAuthenticated) {
      // For now, auto-authenticate for demo purposes
      localStorage.setItem('barbergo_auth', 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('barbergo_auth');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} z-50 h-full w-64 bg-white border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Scissors className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BarberGo</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{adminUser}</p>
                <p className="text-xs text-gray-500 truncate">admin@barbergo.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={direction === 'rtl' ? 'lg:pr-64' : 'lg:pl-64'}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{t('common.appName')}</h1>
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            </div>
            <LanguageToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
