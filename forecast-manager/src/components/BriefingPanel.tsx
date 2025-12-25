import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { DAYS } from '../game/days';

export default function BriefingPanel() {
  const { currentDay, tasksCompleted, useHint, hintsUsed } = useGameStore();
  const [showHint, setShowHint] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);

  const dayConfig = DAYS[currentDay - 1];
  const dayHintsUsed = hintsUsed[currentDay] || 0;

  const completedTasks = dayConfig.tasks.filter((task) =>
    tasksCompleted[task.id]
  ).length;
  const totalTasks = dayConfig.tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  const handleShowHint = () => {
    if (currentHintLevel < dayConfig.hints.length) {
      setCurrentHintLevel((prev) => prev + 1);
      setShowHint(true);
      useHint(currentDay);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">
          Day {currentDay}: {dayConfig.title}
        </h2>
        <p className="text-slate-300 text-sm">{dayConfig.objective}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">
            Progress
          </span>
          <span className="text-xs text-slate-400">
            {completedTasks} / {totalTasks}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Tasks
        </h3>
        <ul className="space-y-2">
          {dayConfig.tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-start gap-2 p-2 rounded ${
                tasksCompleted[task.id]
                  ? 'bg-green-900/20 border border-green-700/30'
                  : 'bg-slate-800/50 border border-slate-700/50'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {tasksCompleted[task.id] ? (
                  <svg
                    className="w-5 h-5 text-green-400"
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
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-200">{task.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  +{task.points} points
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-700 pt-4">
        {showHint && currentHintLevel > 0 && (
          <div className="mb-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded">
            <p className="text-xs text-yellow-200">
              <span className="font-semibold">Hint {currentHintLevel}:</span>{' '}
              {dayConfig.hints[currentHintLevel - 1]}
            </p>
          </div>
        )}

        <button
          onClick={handleShowHint}
          disabled={currentHintLevel >= dayConfig.hints.length}
          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded font-medium text-sm transition-colors"
        >
          {currentHintLevel >= dayConfig.hints.length
            ? 'No More Hints'
            : `Show Hint ${currentHintLevel + 1} (-5 points)`}
        </button>

        {dayHintsUsed > 0 && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Hints used today: {dayHintsUsed}
          </p>
        )}
      </div>
    </div>
  );
}
