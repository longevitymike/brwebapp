
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Trophy, Calendar, Award, User, Mail } from 'lucide-react';
import WorkoutTimeline from '@/components/dashboard/WorkoutTimeline';

interface ChildUser {
  id: string;
  name: string;
  email: string;
}

interface WorkoutLog {
  id: string;
  workout_id: string;
  completed_at: string;
  user_id: string;
  workouts: {
    id: string;
    title: string;
    week: number;
    day: number;
    focus: string;
    duration: number;
  };
}

interface WorkoutComment {
  comment: string;
  workout_id: string;
}

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildUser[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [emailDigest, setEmailDigest] = useState(false);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [workoutsByWeek, setWorkoutsByWeek] = useState<any[]>([]);
  
  // In a real app, we'd get child data from the API
  // Here we'll simulate it since the parent_links table exists but we're using mock auth
  const mockChildren = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
    }
  ];
  
  useEffect(() => {
    // In a real app with Supabase Auth, we'd fetch children linked to the parent
    // For now, we'll use our mock data
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChildId(mockChildren[0].id);
    }
    
    // This would be the real query with parent_links table:
    /*
    if (!user) return;
    
    async function fetchChildren() {
      const { data, error } = await supabase
        .from('parent_links')
        .select('child_id')
        .eq('parent_id', user.id);
        
      if (error) {
        console.error('Error fetching children:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const childIds = data.map(link => link.child_id);
        const { data: childrenData } = await supabase
          .from('profiles')  // assuming you have a profiles table
          .select('id, name, email')
          .in('id', childIds);
          
        setChildren(childrenData || []);
        if (childrenData && childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        }
      }
    }
    
    fetchChildren();
    */
  }, [user]);
  
  useEffect(() => {
    if (!selectedChildId) return;
    
    async function fetchWorkoutData() {
      // Fetch workout logs
      const { data: logs, error: logsError } = await supabase
        .from('workout_logs')
        .select('*, workout_id')
        .eq('user_id', selectedChildId);
        
      if (logsError) {
        console.error('Error fetching workout logs:', logsError);
        return;
      }
      
      setWorkoutLogs(logs || []);
      
      // Fetch all workouts to calculate progress
      const { data: allWorkouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .order('week', { ascending: true })
        .order('day', { ascending: true });
        
      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError);
        return;
      }
      
      setWorkouts(allWorkouts || []);
      
      // Calculate progress percentage
      if (allWorkouts && allWorkouts.length > 0 && logs) {
        const percentage = Math.round((logs.length / allWorkouts.length) * 100);
        setProgressPercentage(percentage);
      }
      
      // Group workouts by week for the chart
      const workoutsByWeekData = allWorkouts?.reduce((acc: any, workout) => {
        if (!acc[workout.week]) {
          acc[workout.week] = { 
            name: `Week ${workout.week}`,
            total: 0,
            completed: 0
          };
        }
        
        acc[workout.week].total++;
        
        // Check if this workout is completed
        if (logs?.some(log => log.workout_id === workout.id)) {
          acc[workout.week].completed++;
        }
        
        return acc;
      }, {});
      
      const chartData = Object.values(workoutsByWeekData || {});
      setWorkoutsByWeek(chartData);
    }
    
    fetchWorkoutData();
  }, [selectedChildId]);
  
  const handleCommentChange = (workoutId: string, value: string) => {
    setComments(prev => ({ ...prev, [workoutId]: value }));
  };
  
  const handleCommentSubmit = async (workoutId: string) => {
    if (!user || !selectedChildId || !comments[workoutId]) return;
    
    try {
      await supabase.from('workout_comments').insert({
        parent_id: user.id,
        child_id: selectedChildId,
        workout_id: workoutId,
        comment: comments[workoutId]
      });
      
      // Clear the comment
      setComments(prev => ({ ...prev, [workoutId]: '' }));
      
      // Here you might want to display a success toast
      console.log('Comment saved successfully');
    } catch (error) {
      console.error('Error saving comment:', error);
      // Here you might want to display an error toast
    }
  };
  
  // Progress data for pie chart
  const progressData = [
    { name: 'Completed', value: progressPercentage },
    { name: 'Remaining', value: 100 - progressPercentage },
  ];
  
  const COLORS = ['#007FFF', '#F3F4F6'];
  
  // For each week, organize workouts
  const workoutsByPhase: Record<string, any[]> = {};
  
  workouts.forEach(workout => {
    const phase = `Week ${workout.week}`;
    if (!workoutsByPhase[phase]) {
      workoutsByPhase[phase] = [];
    }
    workoutsByPhase[phase].push(workout);
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Parent Dashboard</h1>
      
      {/* Child Selector */}
      <div className="card flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">Child Account</div>
          {children.length > 0 ? (
            <Select 
              value={selectedChildId || ''} 
              onValueChange={(value) => setSelectedChildId(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <h2 className="text-xl font-semibold">Alex Johnson</h2>
          )}
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
            <Mail className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Communication Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email-digest" 
                checked={emailDigest}
                onCheckedChange={(checked) => setEmailDigest(!!checked)}
              />
              <label
                htmlFor="email-digest"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receive weekly progress report emails
              </label>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Get summaries of your child's workouts, achievements, and progress delivered to your inbox every Sunday.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={workoutsByWeek}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
      
      {/* Workout Timeline */}
      {Object.entries(workoutsByPhase).map(([phase, phaseWorkouts]) => (
        <WorkoutTimeline 
          key={phase}
          phase={phase}
          workouts={phaseWorkouts}
        />
      ))}
      
      {/* Comments Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Coaching Notes</h3>
        <Textarea 
          className="w-full h-32"
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
