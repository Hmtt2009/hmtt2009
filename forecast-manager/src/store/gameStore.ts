import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  points: number;
}

export interface DayConfig {
  day: number;
  title: string;
  objective: string;
  tasks: Task[];
  starterCode: string;
  hints: string[];
}

export interface GameState {
  // Game progress
  currentDay: number;
  score: number;
  tasksCompleted: Record<string, boolean>;
  hintsUsed: Record<number, number>; // day -> hint count
  dayStartTime: Record<number, number>; // day -> timestamp

  // Python state
  currentCode: string;
  lastOutput: string;
  lastError: string | null;
  dataFramePreview: any[];
  variables: Record<string, any>;

  // Metrics
  baselineMAPE: number | null;
  prophetMAPE: number | null;

  // Game state
  pyodideReady: boolean;
  gameCompleted: boolean;

  // Actions
  setCurrentDay: (day: number) => void;
  completeTask: (taskId: string, points: number) => void;
  useHint: (day: number) => void;
  setCode: (code: string) => void;
  setOutput: (output: string, error: string | null) => void;
  setDataFramePreview: (data: any[]) => void;
  setVariables: (vars: Record<string, any>) => void;
  setBaselineMAPE: (mape: number) => void;
  setProphetMAPE: (mape: number) => void;
  setPyodideReady: (ready: boolean) => void;
  completeGame: () => void;
  resetGame: () => void;
  startDay: (day: number) => void;
  getDayDuration: (day: number) => number;
}

const initialState = {
  currentDay: 1,
  score: 0,
  tasksCompleted: {},
  hintsUsed: {},
  dayStartTime: {},
  currentCode: '',
  lastOutput: '',
  lastError: null,
  dataFramePreview: [],
  variables: {},
  baselineMAPE: null,
  prophetMAPE: null,
  pyodideReady: false,
  gameCompleted: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentDay: (day: number) => set({ currentDay: day }),

      completeTask: (taskId: string, points: number) => {
        const { tasksCompleted, score } = get();
        if (!tasksCompleted[taskId]) {
          set({
            tasksCompleted: { ...tasksCompleted, [taskId]: true },
            score: score + points,
          });
        }
      },

      useHint: (day: number) => {
        const { hintsUsed, score } = get();
        const currentHints = hintsUsed[day] || 0;
        set({
          hintsUsed: { ...hintsUsed, [day]: currentHints + 1 },
          score: score - 5, // Penalty for using hint
        });
      },

      setCode: (code: string) => set({ currentCode: code }),

      setOutput: (output: string, error: string | null) =>
        set({ lastOutput: output, lastError: error }),

      setDataFramePreview: (data: any[]) => set({ dataFramePreview: data }),

      setVariables: (vars: Record<string, any>) => set({ variables: vars }),

      setBaselineMAPE: (mape: number) => set({ baselineMAPE: mape }),

      setProphetMAPE: (mape: number) => set({ prophetMAPE: mape }),

      setPyodideReady: (ready: boolean) => set({ pyodideReady: ready }),

      completeGame: () => set({ gameCompleted: true }),

      resetGame: () => set(initialState),

      startDay: (day: number) => {
        const { dayStartTime } = get();
        if (!dayStartTime[day]) {
          set({
            dayStartTime: { ...dayStartTime, [day]: Date.now() },
          });
        }
      },

      getDayDuration: (day: number): number => {
        const { dayStartTime } = get();
        const startTime = dayStartTime[day];
        if (!startTime) return 0;
        return Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
      },
    }),
    {
      name: 'forecast-manager-game',
    }
  )
);
