
interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar = ({ completed, total }: ProgressBarProps) => {
  return (
    <div className="card">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold">Program Progress</h3>
      </div>
      <div className="mt-2 text-2xl font-bold text-primary">
        {completed} / 42 workouts completed
      </div>
    </div>
  );
};

export default ProgressBar;
