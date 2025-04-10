
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Trophy, Calendar, Award, User } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { 
    workoutLogs, 
    badges, 
    currentStreak, 
    progressPercentage,
    workouts 
  } = useWorkout();
  
  // In a real app, we'd get child data from the API
  // Here we'll simulate it as if the parent is viewing their child's data
  const childUser = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
  };
  
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
    const weeklyProgress: { name: string; completed: number; total: number }[] = [];
    
    // Group workouts by week
    const workoutsByWeek = workouts.reduce((acc, workout) => {
      if (!acc[workout.week]) {
        acc[workout.week] = { total: 0, completed: 0 };
      }
      
      acc[workout.week].total++;
      
      // Check if workout is completed
      const isCompleted = workoutLogs.some(log => log.workoutId === workout.id);
      if (isCompleted) {
        acc[workout.week].completed++;
      }
      
      return acc;
    }, {} as Record<number, { total: number; completed: number }>);
    
    // Convert to array for chart
    Object.entries(workoutsByWeek).forEach(([week, data]) => {
      weeklyProgress.push({
        name: `Week ${week}`,
        completed: data.completed,
        total: data.total,
      });
    });
    
    return weeklyProgress;
  };
  
  const weeklyProgressData = generateWeeklyProgressData();
  
  // Count unlocked badges
  const unlockedBadgesCount = badges.filter(badge => badge.unlocked).length;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Parent Dashboard</h1>
      
      <div className="card flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Child Account</div>
          <h2 className="text-xl font-semibold">{childUser.name}</h2>
        </div>
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
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyProgressData}
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
        <h3 className="text-lg font-semibold mb-4">Coaching Notes</h3>
        <textarea 
          className="w-full border border-gray-300 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Add notes or reminders for your athlete here..."
        />
        <div className="mt-3 flex justify-end">
          <button className="btn-primary">Save Notes</button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
