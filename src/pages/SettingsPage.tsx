
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, LogOut, User, Bell, Shield, HelpCircle, Calendar, Award, TrendingUp, Check } from 'lucide-react';
import Account from '@/components/account/Account';
import Notifications from '@/components/notifications/Notifications';
import Help from '@/components/help/Help';

type SettingSection = 'main' | 'account' | 'notifications' | 'help';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingSection>('main');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
            
            {user?.role === 'parent' && (
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
      
      <div className="card">
        {activeSection === 'main' && (
          <div className="flex items-center gap-4 p-4">
            <img
              src={user?.avatar || 'https://i.pravatar.cc/150?img=11'}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
      
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
