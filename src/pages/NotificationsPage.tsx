
import React, { useState } from 'react';
import { Bell, Check, Calendar, Award, TrendingUp } from 'lucide-react';
import { Switch } from '@/components/ui/toggle';

const NotificationsPage = () => {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [badgeCelebrations, setBadgeCelebrations] = useState(true);
  
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
      <div className="flex items-center">
        <Bell className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold">Notifications</h1>
      </div>
      
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
      
      <div className="card">
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
    </div>
  );
};

export default NotificationsPage;
