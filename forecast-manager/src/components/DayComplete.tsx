import { useGameStore } from '../store/gameStore';
import { DAYS } from '../game/days';
import { calculateDayBonus } from '../game/scoring';

interface DayCompleteProps {
  onNextDay: () => void;
}

export default function DayComplete({ onNextDay }: DayCompleteProps) {
  const { currentDay, hintsUsed, getDayDuration } = useGameStore();

  const dayConfig = DAYS[currentDay - 1];
  const hintsUsedToday = hintsUsed[currentDay] || 0;
  const duration = getDayDuration(currentDay);
  const bonus = calculateDayBonus(currentDay, hintsUsedToday, duration);

  const taskPoints = dayConfig.tasks.reduce((sum, task) => sum + task.points, 0);
  const totalDayPoints = taskPoints + bonus;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-slate-900 border-2 border-green-700 rounded-lg max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-green-900/30 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Day Complete!</h2>
          <p className="text-slate-300">
            Day {currentDay}: {dayConfig.title}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Tasks Completed</span>
            <span className="text-green-400 font-semibold">+{taskPoints}</span>
          </div>

          {hintsUsedToday === 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-300">No Hints Bonus</span>
              <span className="text-blue-400 font-semibold">+20</span>
            </div>
          )}

          {duration < 10 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Speed Bonus</span>
              <span className="text-purple-400 font-semibold">+10</span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold text-lg">
              Day Total
            </span>
            <span className="text-green-400 font-bold text-xl">
              +{totalDayPoints}
            </span>
          </div>
        </div>

        <div className="text-center text-sm text-slate-400 mb-6">
          <p>Time taken: {duration} minutes</p>
          {hintsUsedToday > 0 && <p>Hints used: {hintsUsedToday}</p>}
        </div>

        <button
          onClick={onNextDay}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          {currentDay < 10 ? 'Continue to Next Day →' : 'Complete Game 🎉'}
        </button>
      </div>
    </div>
  );
}
