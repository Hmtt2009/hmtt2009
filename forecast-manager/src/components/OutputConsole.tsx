import { useGameStore } from '../store/gameStore';

export default function OutputConsole() {
  const { lastOutput, lastError } = useGameStore();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Output Console
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {lastError ? (
          <div className="text-red-400 whitespace-pre-wrap">
            <div className="font-semibold mb-2">Error:</div>
            {lastError}
          </div>
        ) : lastOutput ? (
          <div className="text-green-300 whitespace-pre-wrap">{lastOutput}</div>
        ) : (
          <div className="text-slate-500 italic">
            Run your code to see output here...
          </div>
        )}
      </div>
    </div>
  );
}
