import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const STORAGE_KEY = '@todo_tasks';

export function useTaskStorage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function saveTasks(tasks: Task[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to save tasks'));
      throw e;
    }
  }

  async function loadTasks(): Promise<Task[]> {
    try {
      setIsLoading(true);
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          reminderDate: task.reminderDate ? new Date(task.reminderDate) : undefined,
        }));
      }
      return [];
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load tasks'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function clearTasks() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to clear tasks'));
      throw e;
    }
  }

  return {
    saveTasks,
    loadTasks,
    clearTasks,
    isLoading,
    error,
  };
} 