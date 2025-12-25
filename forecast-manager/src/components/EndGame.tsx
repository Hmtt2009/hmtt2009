import { useGameStore } from '../store/gameStore';
import {
  calculateFinalScore,
  getRating,
  getImprovementPercentage,
} from '../game/scoring';

export default function EndGame() {
  const {
    score: baseScore,
    baselineMAPE,
    prophetMAPE,
    hintsUsed,
    dayStartTime,
    resetGame,
  } = useGameStore();

  const scoreBreakdown = calculateFinalScore(
    baseScore,
    hintsUsed,
    dayStartTime,
    prophetMAPE
  );

  const rating = getRating(scoreBreakdown.total);
  const improvement = getImprovementPercentage(baselineMAPE, prophetMAPE);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'S':
        return 'text-yellow-400';
      case 'A':
        return 'text-green-400';
      case 'B':
        return 'text-blue-400';
      case 'C':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  const exportResults = () => {
    const results = {
      rating,
      score: scoreBreakdown,
      baselineMAPE,
      prophetMAPE,
      improvement,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-manager-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            FORECAST DELIVERED
          </h1>
          <div className={`text-6xl font-bold ${getRatingColor(rating)} mb-2`}>
            RATING: {rating}
          </div>
        </div>

        <div className="border-t border-b border-slate-700 py-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Final Accuracy
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-sm text-slate-400 mb-1">Baseline MAPE</div>
              <div className="text-2xl font-bold text-red-400">
                {baselineMAPE ? `${baselineMAPE.toFixed(1)}%` : 'N/A'}
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-sm text-slate-400 mb-1">Your MAPE</div>
              <div className="text-2xl font-bold text-green-400">
                {prophetMAPE ? `${prophetMAPE.toFixed(1)}%` : 'N/A'}
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-sm text-slate-400 mb-1">Improvement</div>
              <div className="text-2xl font-bold text-blue-400">
                {improvement > 0 ? `${improvement}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Score Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
              <span className="text-slate-300">Tasks Completed</span>
              <span className="text-white font-semibold">
                {scoreBreakdown.tasksCompleted}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
              <span className="text-slate-300">No-Hint Bonuses</span>
              <span className="text-green-400 font-semibold">
                +{scoreBreakdown.noHintBonus}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
              <span className="text-slate-300">Speed Bonuses</span>
              <span className="text-blue-400 font-semibold">
                +{scoreBreakdown.speedBonus}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
              <span className="text-slate-300">Accuracy Bonus</span>
              <span className="text-purple-400 font-semibold">
                +{scoreBreakdown.accuracyBonus}
              </span>
            </div>
            <div className="flex justify-between items-center bg-blue-900/30 border border-blue-700 p-4 rounded">
              <span className="text-white font-semibold text-lg">
                TOTAL SCORE
              </span>
              <span className="text-blue-400 font-bold text-2xl">
                {scoreBreakdown.total}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Performance Summary
          </h2>
          <div className="bg-slate-800 p-4 rounded">
            <p className="text-slate-300 mb-2">
              {rating === 'S' && (
                <>
                  <span className="text-yellow-400 font-semibold">
                    Outstanding!
                  </span>{' '}
                  You've mastered forecasting with exceptional accuracy and
                  efficiency.
                </>
              )}
              {rating === 'A' && (
                <>
                  <span className="text-green-400 font-semibold">
                    Excellent work!
                  </span>{' '}
                  Your forecasting skills are top-tier. Great accuracy and
                  methodology.
                </>
              )}
              {rating === 'B' && (
                <>
                  <span className="text-blue-400 font-semibold">
                    Good job!
                  </span>{' '}
                  You've demonstrated solid forecasting abilities with room for
                  optimization.
                </>
              )}
              {rating === 'C' && (
                <>
                  <span className="text-purple-400 font-semibold">
                    Not bad!
                  </span>{' '}
                  You completed the forecast. Consider reviewing your approach
                  for better accuracy.
                </>
              )}
              {rating === 'D' && (
                <>
                  <span className="text-slate-400 font-semibold">
                    Keep practicing!
                  </span>{' '}
                  Forecasting is challenging. Review the tutorials and try
                  again.
                </>
              )}
            </p>
            {prophetMAPE && prophetMAPE < 15 && (
              <p className="text-green-400 text-sm mt-2">
                ✓ You achieved the target accuracy of under 15% MAPE!
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetGame}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-lg transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={exportResults}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold text-lg transition-colors"
          >
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
}
