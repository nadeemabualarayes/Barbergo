import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

export function BarberRoot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/barber/login');
        return;
      }

      // Verify user is a barber
      const userRole = session.user?.user_metadata?.role;
      if (userRole !== 'barber') {
        await supabase.auth.signOut();
        navigate('/barber/login');
        return;
      }

      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/barber/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return <Outlet />;
}
