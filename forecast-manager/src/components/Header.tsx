import { useGameStore } from '../store/gameStore';

export default function Header() {
  const { currentDay, score, prophetMAPE } = useGameStore();

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Forecast Manager
          </h1>
          <p className="text-sm text-slate-400">
            Data Science Simulation Game
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Day
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {currentDay} <span className="text-slate-500">/</span> 10
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Score
            </div>
            <div className="text-2xl font-bold text-green-400">
              {score}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {prophetMAPE ? `${prophetMAPE.toFixed(1)}%` : '--'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
