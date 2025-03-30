import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  categories: string[];
}

type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'TOGGLE_TASK'; taskId: string }
  | { type: 'ADD_CATEGORY'; category: string }
  | { type: 'SET_TASKS'; tasks: Task[] };

const STORAGE_KEY = '@todo_tasks';

const initialState: TaskState = {
  tasks: [],
  categories: ['Personal', 'Work', 'Shopping'],
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  let newState: TaskState;

  switch (action.type) {
    case 'ADD_TASK':
      newState = { ...state, tasks: [...state.tasks, action.task] };
      break;
    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.task.id ? action.task : task
        ),
      };
      break;
    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      };
      break;
    case 'TOGGLE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        ),
      };
      break;
    case 'ADD_CATEGORY':
      newState = {
        ...state,
        categories: [...state.categories, action.category],
      };
      break;
    case 'SET_TASKS':
      newState = {
        ...state,
        tasks: action.tasks,
      };
      break;
    default:
      return state;
  }

  // Save to AsyncStorage whenever state changes
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState.tasks)).catch((error: any) =>
    console.error('Error saving tasks:', error)
  );

  return newState;
}

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
} | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load saved tasks when the app starts
  useEffect(() => {
    async function loadTasks() {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          const tasks = JSON.parse(savedTasks);
          // Convert date strings back to Date objects
          const parsedTasks = tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            reminderDate: task.reminderDate ? new Date(task.reminderDate) : undefined,
          }));
          dispatch({ type: 'SET_TASKS', tasks: parsedTasks });
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    loadTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 