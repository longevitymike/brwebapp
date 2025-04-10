
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const goToParentDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Settings</h1>
      
      <div className="card">
        <div className="flex items-center gap-4">
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
      </div>
      
      <div className="space-y-2">
        <SettingsLink 
          icon={<User className="w-5 h-5" />}
          title="Account"
          description="Update your profile information"
        />
        
        <SettingsLink 
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          description="Manage workout alerts and reminders"
        />
        
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
        
        <SettingsLink 
          icon={<HelpCircle className="w-5 h-5" />}
          title="Help & Support"
          description="Get assistance with the app"
        />
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
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
      {action || <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  );
};

export default SettingsPage;
