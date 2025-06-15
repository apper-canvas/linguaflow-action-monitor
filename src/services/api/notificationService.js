import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userProgressService from '@/services/userProgressService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if notifications are supported
const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Request notification permission
const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    toast.info('Notifications are not supported in this browser');
    return 'default';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Daily practice reminders enabled! 🔔');
    } else if (permission === 'denied') {
      toast.warning('Notifications blocked. You can enable them in browser settings.');
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'default';
  }
};

// Show browser notification
const showBrowserNotification = (title, options = {}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'linguaflow-reminder',
    requireInteraction: true,
    ...options
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Show toast notification as fallback
const showToastNotification = (message, type = 'info') => {
  const toastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: 'bg-gradient-to-r from-primary to-secondary text-white'
  };

  switch (type) {
    case 'reminder':
      toast.info(`🔔 ${message}`, {
        ...toastOptions,
        className: 'bg-gradient-to-r from-accent to-warning text-white'
      });
      break;
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    default:
      toast.info(message, toastOptions);
  }
};

// Main notification service
const notificationService = {
  async sendDailyReminder(activityType = 'practice') {
    await delay(100);
    
    const messages = {
      practice: 'Time for your daily language practice! 📚',
      lessons: 'Don\'t forget to complete today\'s lesson! 🎓',
      flashcards: 'Review your flashcards to reinforce learning! 🧠',
      speaking: 'Practice speaking to improve pronunciation! 🎤'
    };

    const message = messages[activityType] || messages.practice;
    const title = 'LinguaFlow Reminder';

    // Try browser notification first, fall back to toast
    const notification = showBrowserNotification(title, {
      body: message,
      icon: '/favicon.ico',
      tag: `reminder-${activityType}`,
      data: { type: 'daily-reminder', activity: activityType }
    });

    if (!notification) {
      showToastNotification(message, 'reminder');
    }

    return { sent: true, method: notification ? 'browser' : 'toast' };
  },

  async sendStreakReminder(streakDays) {
    await delay(100);
    
    const message = `Keep your ${streakDays}-day streak alive! 🔥`;
    const title = 'Streak Alert';

    const notification = showBrowserNotification(title, {
      body: message,
      icon: '/favicon.ico',
      tag: 'streak-reminder',
      data: { type: 'streak-reminder', streak: streakDays }
    });

    if (!notification) {
      showToastNotification(message, 'reminder');
    }

    return { sent: true, method: notification ? 'browser' : 'toast' };
  },

  async sendCustomReminder(title, message, options = {}) {
    await delay(100);
    
    const notification = showBrowserNotification(title, {
      body: message,
      ...options
    });

    if (!notification) {
      showToastNotification(`${title}: ${message}`, 'reminder');
    }

    return { sent: true, method: notification ? 'browser' : 'toast' };
  },

  getPermissionStatus() {
    if (!isNotificationSupported()) return 'unsupported';
    return Notification.permission;
  },

  async requestPermission() {
    return await requestNotificationPermission();
  }
};

// React hook for notifications
export const useNotifications = () => {
  const [hasUnreadReminders, setHasUnreadReminders] = useState(false);
  const [permission, setPermission] = useState(
    isNotificationSupported() ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    // Check for unread reminders based on last practice date
    const checkReminders = async () => {
      try {
        const progress = await userProgressService.get();
        const today = new Date().toDateString();
        const lastPractice = progress.dailyPractice?.lastPracticeDate;
        
        setHasUnreadReminders(lastPractice !== today);
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const requestPermission = async () => {
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    return newPermission;
  };

  const sendReminder = async (type, options = {}) => {
    return await notificationService.sendDailyReminder(type, options);
  };

  return {
    hasUnreadReminders,
    permission,
    requestPermission,
    sendReminder,
    isSupported: isNotificationSupported()
  };
};

// Initialize notifications and set up daily reminders
export const initializeNotifications = async () => {
  try {
    const progress = await userProgressService.get();
    const reminderTime = progress.dailyPractice?.preferredReminderTime || '19:00';
    const enabledActivities = progress.dailyPractice?.enabledActivities || ['lessons'];

    // Schedule daily reminders
    scheduleReminders(reminderTime, enabledActivities);
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Schedule daily reminders
const scheduleReminders = (time, activities) => {
  const [hours, minutes] = time.split(':').map(Number);
  
  const scheduleNextReminder = () => {
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(async () => {
      try {
        const progress = await userProgressService.get();
        const today = new Date().toDateString();
        
        // Only send reminder if user hasn't practiced today
        if (progress.dailyPractice?.lastPracticeDate !== today) {
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          await notificationService.sendDailyReminder(randomActivity);
        }

        // Schedule next reminder for tomorrow
        scheduleNextReminder();
      } catch (error) {
        console.error('Error sending scheduled reminder:', error);
      }
    }, timeUntilReminder);
  };

  scheduleNextReminder();
};

export default notificationService;