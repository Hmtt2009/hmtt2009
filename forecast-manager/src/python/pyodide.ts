import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let initializationPromise: Promise<PyodideInterface> | null = null;

export interface PythonExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  variables?: Record<string, any>;
}

export async function initPyodide(
  onProgress?: (message: string) => void
): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      onProgress?.('Loading Pyodide... (this may take 30-60 seconds)');

      // Try with timeout - use default indexURL to match installed version
      const pyodide = await Promise.race([
        loadPyodide(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Pyodide load timeout - please check your internet connection')), 120000)
        ),
      ]);

      onProgress?.('Loading packages: pandas, numpy...');
      await pyodide.loadPackage(['pandas', 'numpy']);

      onProgress?.('Loading matplotlib...');
      try {
        await pyodide.loadPackage(['matplotlib']);
      } catch (e) {
        console.warn('matplotlib load failed, continuing without it:', e);
      }

      onProgress?.('Installing Prophet (optional)...');
      try {
        await pyodide.runPythonAsync(`
          import micropip
          await micropip.install('prophet')
        `);
      } catch (e) {
        console.warn('Prophet install failed, continuing without it:', e);
        onProgress?.('Prophet install skipped - some features may be limited');
      }

      onProgress?.('Pyodide ready!');
      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      console.error('Pyodide initialization error:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export async function runPythonCode(
  code: string,
  dataCSV?: string
): Promise<PythonExecutionResult> {
  try {
    if (!pyodideInstance) {
      throw new Error('Pyodide not initialized. Call initPyodide() first.');
    }

    // Redirect stdout to capture print statements
    await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

    // Inject the sales data if provided
    if (dataCSV) {
      pyodideInstance.FS.writeFile('/sales_data.csv', dataCSV);
      pyodideInstance.FS.writeFile('/sales_data_clean.csv', dataCSV);
      pyodideInstance.FS.writeFile('/sales_data_featured.csv', dataCSV);
      pyodideInstance.FS.writeFile('/sales_prophet.csv', dataCSV);
    }

    // Run the user's code
    await pyodideInstance.runPythonAsync(code);

    // Capture stdout and stderr
    const stdout = await pyodideInstance.runPythonAsync('sys.stdout.getvalue()');
    const stderr = await pyodideInstance.runPythonAsync('sys.stderr.getvalue()');

    // Get global variables for validation
    const globals = pyodideInstance.globals.toJs();
    const variables: Record<string, any> = {};

    for (const [key, value] of globals) {
      if (!key.startsWith('_') && key !== 'sys' && key !== 'StringIO') {
        try {
          variables[key] = value;
        } catch (e) {
          // Some objects can't be converted to JS
          variables[key] = '<python object>';
        }
      }
    }

    const output = stdout + (stderr ? `\nErrors:\n${stderr}` : '');

    return {
      success: !stderr || stderr.length === 0,
      output: output || '(no output)',
      variables,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export async function getPythonVariable(name: string): Promise<any> {
  if (!pyodideInstance) {
    throw new Error('Pyodide not initialized');
  }

  try {
    const value = pyodideInstance.globals.get(name);
    return value?.toJs() || null;
  } catch (error) {
    return null;
  }
}

export async function getDataFrame(variableName: string = 'df'): Promise<any[]> {
  if (!pyodideInstance) {
    throw new Error('Pyodide not initialized');
  }

  try {
    const dfDict = await pyodideInstance.runPythonAsync(`
import json
if '${variableName}' in dir():
    ${variableName}.head(100).to_dict('records')
else:
    []
    `);

    return dfDict.toJs();
  } catch (error) {
    console.error('Error getting DataFrame:', error);
    return [];
  }
}

export function isPyodideReady(): boolean {
  return pyodideInstance !== null;
}

export function resetPyodide() {
  pyodideInstance = null;
  initializationPromise = null;
}
