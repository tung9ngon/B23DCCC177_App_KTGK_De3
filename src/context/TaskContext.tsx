import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '../types';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { createSampleTasks } from '../data/sampleTasks';

type TaskContextValue = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'done'>) => void;
  updateTask: (task: Task) => void;
  toggleDone: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteDoneTasks: () => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTasks()
      .then(saved => setTasks(saved ?? createSampleTasks()))
      .catch(() => setTasks(createSampleTasks()))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  const addTask = (data: Omit<Task, 'id' | 'done'>) => {
    const newTask: Task = { ...data, id: Date.now().toString(), done: false };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
  };

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteDoneTasks = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, toggleDone, deleteTask, deleteDoneTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks phải dùng bên trong TaskProvider');
  }
  return ctx;
}
