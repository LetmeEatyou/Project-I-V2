import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Task = {
  id: string;
  name: string;
  target: string;
  description: string;
  completedDates: string[];
};

type Preferences = {
  haptics: boolean;
  reminders: boolean;
};

type TaskContextValue = {
  tasks: Task[];
  preferences: Preferences;
  isReady: boolean;
  addTask: (name: string, target: string, description: string) => void;
  updateTask: (id: string, name: string, target: string, description: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string, dateKey: string) => void;
  setPreference: (key: keyof Preferences, value: boolean) => void;
};

const TASKS_KEY = 'istiqamah.tasks.v1';
const PREFERENCES_KEY = 'istiqamah.preferences.v1';

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const seedTasks = (): Task[] => [
  { id: 'fajr', name: 'Fajr Block', target: '05:00', description: 'Start the day before the noise.', completedDates: [] },
  { id: 'work', name: 'Work Hours Discipline', target: '09:00', description: 'Stay focused. Follow the plan.', completedDates: [] },
  { id: 'evening', name: 'Evening Block', target: '19:30', description: 'Close the day with intention.', completedDates: [] },
  { id: 'night', name: 'Night Block', target: '21:30', description: 'Prepare tomorrow before sleep.', completedDates: [] },
];

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({ haptics: true, reminders: false });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(TASKS_KEY), AsyncStorage.getItem(PREFERENCES_KEY)])
      .then(([storedTasks, storedPreferences]) => {
        setTasks(storedTasks ? JSON.parse(storedTasks) as Task[] : seedTasks());
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences) as Preferences);
        }
      })
      .catch(() => {
        setTasks(seedTasks());
      })
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks)).catch(() => undefined);
    }
  }, [isReady, tasks]);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)).catch(() => undefined);
    }
  }, [isReady, preferences]);

  const addTask = (name: string, target: string, description: string) => {
    setTasks((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        target: target.trim() || 'Anytime',
        description: description.trim() || 'Make room for what matters.',
        completedDates: [],
      },
    ]);
  };

  const updateTask = (id: string, name: string, target: string, description: string) => {
    setTasks((current) => current.map((task) => (
      task.id === id
        ? { ...task, name: name.trim(), target: target.trim() || 'Anytime', description: description.trim() || task.description }
        : task
    )));
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string, currentDateKey: string) => {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const completed = task.completedDates.includes(currentDateKey);
      return {
        ...task,
        completedDates: completed
          ? task.completedDates.filter((date) => date !== currentDateKey)
          : [...task.completedDates, currentDateKey],
      };
    }));
  };

  const setPreference = (key: keyof Preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const value = useMemo(() => ({
    tasks,
    preferences,
    isReady,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setPreference,
  }), [tasks, preferences, isReady]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}

export { dateKey };