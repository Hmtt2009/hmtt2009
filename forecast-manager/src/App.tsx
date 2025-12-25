import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { initPyodide } from './python/pyodide';
import { DAYS } from './game/days';
import Header from './components/Header';
import BriefingPanel from './components/BriefingPanel';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import DataPreview from './components/DataPreview';
import DayComplete from './components/DayComplete';
import EndGame from './components/EndGame';

function App() {
  const {
    currentDay,
    tasksCompleted,
    pyodideReady,
    setPyodideReady,
    setCurrentDay,
    startDay,
    gameCompleted,
    completeGame,
  } = useGameStore();

  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [showDayComplete, setShowDayComplete] = useState(false);

  // Initialize Pyodide on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initPyodide((message) => setLoadingMessage(message));
        setPyodideReady(true);
        setLoadingMessage('');
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        setLoadingMessage('Failed to load Python environment. Please refresh.');
      }
    };

    init();
  }, []);

  // Start the day timer when day changes
  useEffect(() => {
    startDay(currentDay);
  }, [currentDay]);

  // Check if all tasks for current day are completed
  useEffect(() => {
    const dayConfig = DAYS[currentDay - 1];
    const allTasksComplete = dayConfig.tasks.every(
      (task) => tasksCompleted[task.id]
    );

    if (allTasksComplete && pyodideReady) {
      setShowDayComplete(true);
    }
  }, [tasksCompleted, currentDay, pyodideReady]);

  const handleNextDay = () => {
    setShowDayComplete(false);

    if (currentDay >= 10) {
      completeGame();
    } else {
      setCurrentDay(currentDay + 1);
    }
  };

  // Show loading screen while Pyodide initializes
  if (!pyodideReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-900/30 rounded-full mb-4">
            <svg
              className="animate-spin h-16 w-16 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Forecast Manager
          </h2>
          <p className="text-slate-400">{loadingMessage}</p>
          <p className="text-sm text-slate-500 mt-4">
            This may take 15-30 seconds on first load...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full min-h-[calc(100vh-8rem)]">
          {/* Top Left: Briefing Panel */}
          <div className="row-span-1">
            <BriefingPanel />
          </div>

          {/* Top Right: Code Editor */}
          <div className="row-span-1">
            <CodeEditor />
          </div>

          {/* Bottom Left: Output Console */}
          <div className="row-span-1">
            <OutputConsole />
          </div>

          {/* Bottom Right: Data Preview */}
          <div className="row-span-1">
            <DataPreview />
          </div>
        </div>
      </main>

      {/* Day Complete Modal */}
      {showDayComplete && <DayComplete onNextDay={handleNextDay} />}

      {/* End Game Screen */}
      {gameCompleted && <EndGame />}
    </div>
  );
}

export default App;
