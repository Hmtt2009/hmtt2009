import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/gameStore';
import { DAYS } from '../game/days';
import { runPythonCode } from '../python/pyodide';
import { validateTasks } from '../game/validations';
import { generateSalesData } from '../python/dataGenerator';

export default function CodeEditor() {
  const {
    currentDay,
    currentCode,
    setCode,
    setOutput,
    setVariables,
    completeTask,
    pyodideReady,
  } = useGameStore();

  const dayConfig = DAYS[currentDay - 1];
  const [isRunning, setIsRunning] = useState(false);
  const [salesData] = useState(() => generateSalesData());

  useEffect(() => {
    if (!currentCode || currentCode === '') {
      setCode(dayConfig.starterCode);
    }
  }, [currentDay]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunCode = async () => {
    if (!pyodideReady) {
      setOutput('', 'Pyodide is still loading. Please wait...');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...', null);

    try {
      const result = await runPythonCode(currentCode, salesData);

      if (result.success) {
        setOutput(result.output || '(no output)', null);
        setVariables(result.variables || {});

        // Validate tasks
        const validations = validateTasks(currentDay, result);

        let outputWithValidation = result.output || '';
        outputWithValidation += '\n\n--- Task Validation ---\n';

        validations.forEach((validation) => {
          outputWithValidation += `\n${validation.message}`;

          if (validation.passed) {
            const task = dayConfig.tasks.find((t) => t.id === validation.taskId);
            if (task) {
              completeTask(task.id, task.points);
            }
          }
        });

        setOutput(outputWithValidation, null);
      } else {
        setOutput('', result.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      setOutput('', error.message || String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(dayConfig.starterCode);
    setOutput('', null);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Code Editor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !pyodideReady}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                Running...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={currentCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
