import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { ChevronRight, LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react'; // Removed unused icons
import Account from '@/components/account/Account';
import Notifications from '@/components/notifications/Notifications';
import Help from '@/components/help/Help';

type SettingSection = 'main' | 'account' | 'notifications' | 'help';

const SettingsPage = () => {
  const { user } = useAuth(); // Get user from Supabase hook
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingSection>('main');

  // Define logout handler using supabase client
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      // Optionally show an error toast to the user
    } else {
      navigate('/login', { replace: true }); // Redirect to login on successful logout, replace history
    }
  };
  // Removed duplicate declarations of navigate and activeSection/setActiveSection
  
  // Remove old mock logout handler
  
  const goToParentDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return <Account />;
      case 'notifications':
        return <Notifications />;
      case 'help':
        return <Help />;
      default:
        return (
          <div className="space-y-2">
            <div onClick={() => setActiveSection('account')}>
              <SettingsLink 
                icon={<User className="w-5 h-5" />}
                title="Account"
                description="Update your profile information"
                action={<ChevronRight className="w-5 h-5 text-gray-400" />}
              />
            </div>
            
            <div onClick={() => setActiveSection('notifications')}>
              <SettingsLink 
                icon={<Bell className="w-5 h-5" />}
                title="Notifications"
                description="Manage workout alerts and reminders"
                action={<ChevronRight className="w-5 h-5 text-gray-400" />}
              />
            </div>
            
            {/* TODO: Need to fetch user role from 'profiles' table to show Parent Dashboard link */}
            {/* TODO: Need to fetch user role from 'profiles' table to show Parent Dashboard link */}
            {/* Example structure if role was available:
            {profile?.role === 'parent' && (
              <button
                onClick={goToParentDashboard}
                className="w-full text-left"
              >
                <SettingsLink
                  icon={<Shield className="w-5 h-5" />}
                  title="Parent Dashboard"
                  description="View your child's progress"
                  action={<ChevronRight className="w-5 h-5 text-gray-400" />}
                />
              </button>
            )}
            */}
            
            <div onClick={() => setActiveSection('help')}>
              <SettingsLink 
                icon={<HelpCircle className="w-5 h-5" />}
                title="Help & Support"
                description="Get assistance with the app"
                action={<ChevronRight className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold">
          {activeSection === 'main' ? 'Settings' : 
           activeSection === 'account' ? 'Account' :
           activeSection === 'notifications' ? 'Notifications' : 'Help & Support'}
        </h1>
        
        {activeSection !== 'main' && (
          <button 
            onClick={() => setActiveSection('main')}
            className="text-primary hover:underline text-sm"
          >
            Back to Settings
          </button>
        )}
      </div>
      
      {/* Only show user info card on the main settings screen */}
      {activeSection === 'main' && (
        <div className="card">
          <div className="flex items-center gap-4 p-4">
            <img
              // TODO: Fetch avatar and name from 'profiles' table
              src={user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=' + user?.id} // Example using metadata or pravatar fallback
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">{user?.user_metadata?.name || user?.email?.split('@')[0]}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
      
      {renderSection()}
      
      {activeSection === 'main' && (
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface SettingsLinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const SettingsLink = ({ icon, title, description, action }: SettingsLinkProps) => {
  return (
    <div className="card flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
};

export default SettingsPage;
