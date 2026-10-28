import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const KEY = 'TASKS';

export async function loadTasks(): Promise<Task[] | null> {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : null;
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}
