
interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar = ({ completed, total }: ProgressBarProps) => {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Program Progress</h3>
        <span className="text-sm font-medium bg-primary text-white px-2 py-1 rounded-full">
          {percentage}%
        </span>
      </div>
      
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-gradient rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        <span className="font-medium">{completed}</span> of <span className="font-medium">{total}</span> workouts completed
      </div>
    </div>
  );
};

export default ProgressBar;
