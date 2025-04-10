
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Trophy, Calendar, Award, User, Bell, Share2, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { 
    workoutLogs, 
    badges, 
    currentStreak, 
    progressPercentage,
    workouts,
    getWorkoutsByPhase,
    getUnlockedBadges
  } = useWorkout();
  
  // For child switching functionality
  const [selectedChild, setSelectedChild] = useState({
    id: '1',
    name: 'Alex Johnson',
    age: 12
  });
  
  const children = [
    { id: '1', name: 'Alex Johnson', age: 12 },
    { id: '2', name: 'Sam Johnson', age: 10 }
  ];
  
  // For email toggle
  const [emailDigest, setEmailDigest] = useState(true);
  
  // For notes
  const [notes, setNotes] = useState('Alex is making great progress! Working on proper form for toe lifts.');
  
  const calculateLastWorkoutDate = () => {
    if (workoutLogs.length === 0) return 'No workouts yet';
    
    const sortedLogs = [...workoutLogs].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    const mostRecent = new Date(sortedLogs[0].completedAt);
    return mostRecent.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Progress data for pie chart
  const progressData = [
    { name: 'Completed', value: progressPercentage },
    { name: 'Remaining', value: 100 - progressPercentage },
  ];
  
  const COLORS = ['#007FFF', '#F3F4F6'];
  
  // Weekly progress for bar chart
  const generateWeeklyProgressData = () => {
    const workoutsByPhase = getWorkoutsByPhase();
    const phases = ['foundation', 'progression', 'mastery'];
    const data = [];
    
    phases.forEach(phase => {
      if (!workoutsByPhase[phase]) return;
      
      const phaseWorkouts = workoutsByPhase[phase];
      const total = phaseWorkouts.length;
      const completed = phaseWorkouts.filter(workout => 
        workoutLogs.some(log => log.workoutId === workout.id)
      ).length;
      
      data.push({
        name: phase.charAt(0).toUpperCase() + phase.slice(1),
        completed,
        total
      });
    });
    
    return data;
  };
  
  const phaseProgressData = generateWeeklyProgressData();
  
  // Special behavioral badges for parent dashboard
  const behaviorBadges = [
    { id: 'b1', name: 'Consistency King', earned: currentStreak >= 5, description: '5+ day streak' },
    { id: 'b2', name: 'No Skip Hero', earned: true, description: 'Completed all assigned workouts' },
    { id: 'b3', name: 'Early Riser', earned: false, description: 'Completes workouts before 9am' },
    { id: 'b4', name: 'Form Master', earned: false, description: 'Perfect form on all exercises' }
  ];
  
  // Count unlocked badges
  const unlockedBadges = getUnlockedBadges();
  const unlockedBadgesCount = unlockedBadges.length;
  
  const handleShareProgress = () => {
    toast.success("Progress sharing enabled!", {
      description: "A shareable progress report has been created and sent to your email.",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-serif font-bold">Parent Dashboard</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{selectedChild.name}</div>
              <div className="text-xs text-muted-foreground">Age {selectedChild.age}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {children.map(child => (
              <DropdownMenuItem 
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm">{child.name}</div>
                    <div className="text-xs text-muted-foreground">Age {child.age}</div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center mb-4">
            <Trophy className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Program Progress</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <div className="text-3xl font-bold">{progressPercentage}%</div>
              <div className="text-muted-foreground">Program completed</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Activity Status</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-primary">{currentStreak}</div>
              <div className="text-xs text-muted-foreground mt-1">consecutive days</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground mb-1">Last Workout</div>
              <div className="text-lg font-medium">{calculateLastWorkoutDate()}</div>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Badges Earned</div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{unlockedBadgesCount} / {badges.length}</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${(unlockedBadgesCount / badges.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Phase Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={phaseProgressData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar name="Completed" dataKey="completed" fill="#007FFF" radius={[4, 4, 0, 0]} />
              <Bar name="Total" dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Behavior Badges</h3>
          <button 
            className="text-sm text-primary flex items-center"
            onClick={() => toast.info("More badges available as your child progresses!")}
          >
            View all
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {behaviorBadges.map(badge => (
            <Card 
              key={badge.id} 
              className={`border ${badge.earned ? 'border-yellow-200' : 'border-gray-100 opacity-50'}`}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  {badge.earned ? (
                    <Award className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Award className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="font-medium text-sm">{badge.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Parent Notes</h3>
          <textarea 
            className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Add notes or reminders for your athlete here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button 
              className="btn-primary"
              onClick={() => toast.success("Notes saved successfully!")}
            >
              Save Notes
            </button>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Parent Controls</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Weekly Email Digest</div>
                <div className="text-sm text-muted-foreground">Receive progress updates every Sunday</div>
              </div>
              <Switch 
                checked={emailDigest} 
                onCheckedChange={setEmailDigest} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Workout Reminders</div>
                  <div className="text-sm text-muted-foreground">Daily push notifications</div>
                </div>
              </div>
              <button 
                className="text-xs text-primary font-medium"
                onClick={() => toast.info("Notification settings can be customized in the main settings panel.")}
              >
                Configure
              </button>
            </div>
            
            <button
              onClick={handleShareProgress}
              className="flex items-center justify-center w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" /> 
              Share Progress Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
