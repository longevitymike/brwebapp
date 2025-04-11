
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  
  // Account settings states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'athlete',
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Notification settings states
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [badgeCelebrations, setBadgeCelebrations] = useState(true);
  
  // FAQ states for help section
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const goToParentDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      // Show success message
      alert('Profile updated successfully!');
    }, 1000);
  };
  
  const toggleSection = (id: string) => {
    if (activeFaq === id) {
      setActiveFaq(null);
    } else {
      setActiveFaq(id);
    }
  };
  
  // FAQ data for help section
  const faqSections = [
    {
      id: 'getting-started',
      title: '🏁 Getting Started',
      questions: [
        { q: 'How do I start my first workout?', a: 'Go to the Dashboard and click on the workout card for today.' },
        { q: 'How often should I train?', a: 'For best results, follow the schedule of 3-4 workouts per week.' }
      ]
    },
    {
      id: 'account',
      title: '💳 Account & Payments',
      questions: [
        { q: 'How do I update my email?', a: 'Head to Account settings to update your personal information.' },
        { q: 'Is there a family plan?', a: 'Yes! You can add multiple children under a single parent account.' }
      ]
    },
    {
      id: 'troubleshooting',
      title: '🔧 Troubleshooting',
      questions: [
        { q: 'My workout isn\'t loading', a: 'Try refreshing the page or checking your internet connection.' },
        { q: 'I can\'t see my progress', a: 'Make sure you\'ve completed at least one workout to see progress.' }
      ]
    },
    {
      id: 'program',
      title: '📦 Program Questions',
      questions: [
        { q: 'How long is the program?', a: 'The standard program runs for 8 weeks with progressive difficulty.' },
        { q: 'Can I skip ahead?', a: 'We recommend following the structured program for best results.' }
      ]
    }
  ];
  
  // Recent notifications data
  const notifications = [
    { 
      id: 1, 
      type: 'badge', 
      title: 'You unlocked a badge!', 
      description: 'Congratulations on earning the Balance Master badge.',
      time: '2 hours ago',
      icon: <Award className="w-5 h-5 text-primary" />
    },
    { 
      id: 2, 
      type: 'workout', 
      title: 'Don\'t forget today\'s workout', 
      description: 'Your Stability training session is scheduled for today.',
      time: '5 hours ago',
      icon: <Calendar className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 3, 
      type: 'report', 
      title: 'Weekly Progress Report is available', 
      description: 'Check out how you did last week!',
      time: '1 day ago',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />
    },
    { 
      id: 4, 
      type: 'achievement', 
      title: 'New achievement unlocked!', 
      description: 'You\'ve completed 5 consecutive workouts.',
      time: '3 days ago',
      icon: <Check className="w-5 h-5 text-green-500" />
    }
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Settings</h1>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
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
          
          <div className="space-y-2 mt-6">
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
            
            <div className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="text-primary">🌙</div>
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Dark or light mode</p>
                </div>
              </div>
              <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            </div>
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
        </TabsContent>
        
        {/* Account Settings Tab */}
        <TabsContent value="account">
          <div className="card">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
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
                  <User className="w-4 h-4" />
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
                    <User className="inline w-4 h-4 mr-2" />
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
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Workout Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming workouts</p>
                </div>
                <Switch 
                  checked={workoutReminders} 
                  onCheckedChange={setWorkoutReminders} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive weekly progress updates</p>
                </div>
                <Switch 
                  checked={weeklyReports} 
                  onCheckedChange={setWeeklyReports} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Badge Celebrations</p>
                  <p className="text-sm text-muted-foreground">Show special effects when earning badges</p>
                </div>
                <Switch 
                  checked={badgeCelebrations} 
                  onCheckedChange={setBadgeCelebrations} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
            
            <div className="divide-y divide-border">
              {notifications.map(notification => (
                <div key={notification.id} className="py-4 flex">
                  <div className="mr-4 bg-background p-2 rounded-full">
                    {notification.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Help & Support Tab */}
        <TabsContent value="help">
          <div className="card p-4">
            <p className="mb-6">Find answers to frequently asked questions below. Can't find what you're looking for? Contact our support team.</p>
            
            <div className="space-y-4">
              {faqSections.map(section => (
                <div key={section.id} className="border border-border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium bg-background/50 hover:bg-background/80"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className={`transform transition-transform ${activeFaq === section.id ? 'rotate-90' : ''} w-5 h-5`} />
                  </button>
                  
                  {activeFaq === section.id && (
                    <div className="p-4 bg-background/20">
                      <ul className="space-y-4">
                        {section.questions.map((item, idx) => (
                          <li key={idx}>
                            <p className="font-medium mb-1">{item.q}</p>
                            <p className="text-muted-foreground">{item.a}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
              <p className="text-lg font-medium mb-2">AI Coach Coming Soon! 🧠</p>
              <p className="text-muted-foreground">Get personalized training advice and answers to all your questions.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
