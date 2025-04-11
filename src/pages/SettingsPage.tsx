
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Bell, Award, Calendar, TrendingUp, Check } from "lucide-react";

const SettingsPage = () => {
  const { isDark } = useTheme();
  
  // Notifications state
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [badgeCelebrations, setBadgeCelebrations] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Settings</h1>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          <TabsTrigger value="help" className="flex-1">Help & Support</TabsTrigger>
          <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
        </TabsList>

        {/* Notifications Tab Content */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center">
            <Bell className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>

          <div className="card p-4 space-y-4">
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
          
          <h2 className="text-xl font-semibold">Recent Notifications</h2>
          <div className="card divide-y divide-border">
            <div className="py-4 px-4 flex">
              <div className="mr-4 bg-background p-2 rounded-full">
                <Award className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="font-medium">You unlocked a badge!</p>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Congratulations on earning the Balance Master badge.</p>
              </div>
            </div>
            
            <div className="py-4 px-4 flex">
              <div className="mr-4 bg-background p-2 rounded-full">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Don't forget today's workout</p>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Stability training session is scheduled for today.</p>
              </div>
            </div>
            
            <div className="py-4 px-4 flex">
              <div className="mr-4 bg-background p-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Weekly Progress Report is available</p>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <p className="text-sm text-muted-foreground">Check out how you did last week!</p>
              </div>
            </div>
            
            <div className="py-4 px-4 flex">
              <div className="mr-4 bg-background p-2 rounded-full">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="font-medium">New achievement unlocked!</p>
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">You've completed 5 consecutive workouts.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Help & Support Tab Content */}
        <TabsContent value="help" className="space-y-6">
          <h2 className="text-xl font-semibold">Help & Support</h2>
          
          <div className="card space-y-4 p-4">
            <div className="p-3 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
              <p className="font-medium mb-1">🏁 Getting Started</p>
              <p className="text-sm text-muted-foreground">Learn the basics of the Barefoot Reset program</p>
            </div>
            
            <div className="p-3 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
              <p className="font-medium mb-1">💳 Account & Payments</p>
              <p className="text-sm text-muted-foreground">Manage your account and subscription details</p>
            </div>
            
            <div className="p-3 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
              <p className="font-medium mb-1">🔧 Troubleshooting</p>
              <p className="text-sm text-muted-foreground">Fix common issues and get technical support</p>
            </div>
            
            <div className="p-3 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
              <p className="font-medium mb-1">📦 Program Questions</p>
              <p className="text-sm text-muted-foreground">Detailed information about exercises and program structure</p>
            </div>
          </div>
          
          <div className="card p-6 text-center">
            <p className="text-lg font-medium mb-2">AI Coach is stretching...</p>
            <p className="text-muted-foreground">Our AI-powered coach will be available soon to answer your questions in real-time!</p>
            <div className="mt-4 inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Coming Soon 🧠
            </div>
          </div>
        </TabsContent>

        {/* Account Settings Tab Content */}
        <TabsContent value="account" className="space-y-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          
          <div className="card p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select className="w-full px-3 py-2 border rounded-md bg-background">
                <option value="athlete">Athlete</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="card p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle isDark={isDark} toggleTheme={() => {}} />
            </div>
          </div>
          
          <button className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors px-4 py-2 rounded-md mt-6">
            Sign Out
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
