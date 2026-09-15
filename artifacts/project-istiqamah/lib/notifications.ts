import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/context/task-context';
import { blockWindowForDate } from '@/lib/time';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleBlockNotifications(task: Task, date: Date, reminderMinutes = 5) {
  if (Platform.OS === 'web') return;
  const permitted = await requestNotificationPermission();
  if (!permitted) return;
  const { start } = blockWindowForDate(date, task.startTime, task.endTime);
  const reminder = new Date(start.getTime() - reminderMinutes * 60 * 1000);
  const now = new Date();
  if (reminder > now) {
    await Notifications.scheduleNotificationAsync({
      content: { title: `${task.name} starts soon`, body: `Your block begins in ${reminderMinutes} minutes.`, data: { taskId: task.id, kind: 'reminder' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder },
    });
  }
  if (start > now) {
    await Notifications.scheduleNotificationAsync({
      content: { title: `${task.name} is starting`, body: `Your ${task.endTime} block is now live.`, data: { taskId: task.id, kind: 'start' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: start },
    });
  }
}

export async function syncUpcomingBlockNotifications(tasks: Task[]) {
  if (Platform.OS === 'web') return;
  const permitted = await requestNotificationPermission();
  if (!permitted) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  for (const task of tasks) {
    await scheduleBlockNotifications(task, today, 5);
    await scheduleBlockNotifications(task, tomorrow, 5);
  }
}