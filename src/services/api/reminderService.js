import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userProgressService from '@/services/userProgressService';
import notificationService from './notificationService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Default reminder settings
const defaultSettings = {
  enabled: true,
  time: '19:00',
  activities: ['lessons', 'flashcards', 'speaking'],
  weekdaysOnly: false,
  streakReminders: true
};

// Get reminder settings from localStorage
const getReminderSettings = () => {
  try {
    const stored = localStorage.getItem('linguaflow-reminders');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch (error) {
    console.error('Error loading reminder settings:', error);
    return defaultSettings;
  }
};

// Save reminder settings to localStorage
const saveReminderSettings = (settings) => {
  try {
    localStorage.setItem('linguaflow-reminders', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving reminder settings:', error);
  }
};

// Reminder service
const reminderService = {
  async getSettings() {
    await delay(200);
    return getReminderSettings();
  },

  async updateSettings(newSettings) {
    await delay(300);
    const updatedSettings = { ...getReminderSettings(), ...newSettings };
    saveReminderSettings(updatedSettings);
    
    // Update user progress service
    await userProgressService.updateReminderPreferences({
      preferredReminderTime: updatedSettings.time,
      enabledActivities: updatedSettings.activities
    });

    toast.success('Reminder settings updated successfully!');
    return updatedSettings;
  },

  async toggleReminders(enabled) {
    await delay(200);
    const settings = getReminderSettings();
    settings.enabled = enabled;
    saveReminderSettings(settings);
    
    if (enabled) {
      toast.success('Daily reminders enabled! 🔔');
    } else {
      toast.info('Daily reminders disabled');
    }
    
    return settings;
  },

  async setReminderTime(time) {
    await delay(200);
    const settings = getReminderSettings();
    settings.time = time;
    saveReminderSettings(settings);
    
    toast.success(`Reminder time set to ${time}`);
    return settings;
  },

  async updateActivities(activities) {
    await delay(200);
    const settings = getReminderSettings();
    settings.activities = activities;
    saveReminderSettings(settings);
    
    toast.success('Reminder activities updated!');
    return settings;
  },

  async sendTestReminder() {
    await delay(300);
    const settings = getReminderSettings();
    
    if (!settings.enabled) {
      toast.warning('Reminders are currently disabled');
      return { sent: false, reason: 'disabled' };
    }

    const activity = settings.activities[0] || 'practice';
    const result = await notificationService.sendDailyReminder(activity);
    
    if (result.sent) {
      toast.success(`Test reminder sent via ${result.method}!`);
    } else {
      toast.error('Failed to send test reminder');
    }
    
    return result;
  },

  async checkTodaysPractice() {
    await delay(200);
    const progress = await userProgressService.get();
    const today = new Date().toDateString();
    
    return {
      completed: progress.dailyPractice?.lastPracticeDate === today,
      streak: progress.currentStreak || 0,
      lastPracticeDate: progress.dailyPractice?.lastPracticeDate
    };
  },

  async markPracticeComplete(activityType = 'general') {
    await delay(300);
    await userProgressService.markDailyPracticeComplete();
    
    const progress = await userProgressService.get();
    const streak = progress.currentStreak || 0;
    
    // Send congratulations notification
    if (streak > 0 && streak % 7 === 0) {
      await notificationService.sendStreakReminder(streak);
    }
    
    return {
      completed: true,
      streak,
      xpEarned: 25 // Base XP for daily practice
    };
  },

  async getReminderHistory() {
    await delay(200);
    // This would typically fetch from a backend
    // For now, return mock data
    return [
      {
        id: 1,
        date: new Date().toISOString(),
        type: 'daily-practice',
        activity: 'lessons',
        sent: true,
        clicked: false
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'streak-reminder',
        activity: 'general',
        sent: true,
        clicked: true
      }
    ];
  }
};

// React hook for reminder management
export const useReminders = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const reminderSettings = await reminderService.getSettings();
        setSettings(reminderSettings);
      } catch (err) {
        setError(err.message || 'Failed to load reminder settings');
        toast.error('Failed to load reminder settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await reminderService.updateSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update settings');
      toast.error('Failed to update reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const sendTestReminder = async () => {
    setLoading(true);
    try {
      return await reminderService.sendTestReminder();
    } catch (err) {
      setError(err.message || 'Failed to send test reminder');
      toast.error('Failed to send test reminder');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    sendTestReminder
  };
};

export default reminderService;