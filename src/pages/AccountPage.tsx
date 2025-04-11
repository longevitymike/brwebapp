
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const AccountPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'athlete',
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleToggle = () => {
    setProfileData(prev => ({
      ...prev,
      role: prev.role === 'athlete' ? 'parent' : 'athlete'
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      // Show success message
      alert('Profile updated successfully!');
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Account Settings</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <img
              src={user?.avatar || 'https://i.pravatar.cc/150?img=11'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <button 
              type="button" 
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white"
              title="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                <User className="inline w-4 h-4 mr-2" />
                Display Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profileData.name}
                onChange={handleChange}
                className="w-full p-2 rounded border border-input bg-background"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-input bg-background"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Account Role</label>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={profileData.role === 'athlete' ? 'default' : 'outline'} 
                  className="cursor-pointer px-4 py-1.5 text-sm"
                  onClick={() => setProfileData(prev => ({...prev, role: 'athlete'}))}
                >
                  Athlete
                </Badge>
                <Badge 
                  variant={profileData.role === 'parent' ? 'default' : 'outline'} 
                  className="cursor-pointer px-4 py-1.5 text-sm"
                  onClick={() => setProfileData(prev => ({...prev, role: 'parent'}))}
                >
                  Parent
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">App Theme</label>
              <div className="flex items-center gap-2">
                <span>Light</span>
                <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                <span>Dark</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Choose between light and dark mode for the app interface
              </p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
