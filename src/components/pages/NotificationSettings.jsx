import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useReminders } from '@/services/api/reminderService';
import { useNotifications } from '@/services/api/notificationService';

const NotificationSettings = () => {
  const { settings, loading, updateSettings, sendTestReminder } = useReminders();
  const { permission, requestPermission } = useNotifications();
  const [localSettings, setLocalSettings] = useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggleReminders = async (enabled) => {
    const updated = { ...localSettings, enabled };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleTimeChange = async (time) => {
    const updated = { ...localSettings, time };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleActivityToggle = async (activity) => {
    const activities = localSettings.activities.includes(activity)
      ? localSettings.activities.filter(a => a !== activity)
      : [...localSettings.activities, activity];
    
    const updated = { ...localSettings, activities };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleWeekdaysToggle = async (weekdaysOnly) => {
    const updated = { ...localSettings, weekdaysOnly };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleTestReminder = async () => {
    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        toast.warning('Please enable notifications to test reminders');
        return;
      }
    }
    await sendTestReminder();
  };

  const activityOptions = [
    { id: 'lessons', label: 'Lessons', icon: 'BookOpen', description: 'Complete daily lessons' },
    { id: 'flashcards', label: 'Flashcards', icon: 'Brain', description: 'Review vocabulary cards' },
    { id: 'speaking', label: 'Speaking', icon: 'Mic', description: 'Practice pronunciation' },
    { id: 'quiz', label: 'Quizzes', icon: 'FileQuestion', description: 'Test your knowledge' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <ApperIcon name="Bell" className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-heading font-bold text-surface-900 mb-2"
        >
          Daily Practice Reminders
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-surface-600 text-lg"
        >
          Set up reminders to maintain your learning streak
        </motion.p>
      </div>

      {/* Permission Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-surface-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              permission === 'granted' ? 'bg-success' : 
              permission === 'denied' ? 'bg-error' : 'bg-warning'
            }`} />
            <div>
              <h3 className="font-semibold text-surface-900">Browser Notifications</h3>
              <p className="text-sm text-surface-600">
                {permission === 'granted' ? 'Enabled - You\'ll receive browser notifications' :
                 permission === 'denied' ? 'Blocked - Enable in browser settings' :
                 'Not configured - Click to enable'}
              </p>
            </div>
          </div>
          
          {permission !== 'granted' && (
            <Button
              variant="primary"
              size="sm"
              onClick={requestPermission}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Shield" className="w-4 h-4" />
              <span>Enable</span>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Main Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-surface-200"
      >
        <h2 className="text-xl font-semibold text-surface-900 mb-6">Reminder Settings</h2>
        
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-surface-200">
          <div>
            <h3 className="font-medium text-surface-900">Daily Reminders</h3>
            <p className="text-sm text-surface-600">Get notified to practice every day</p>
          </div>
          <button
            onClick={() => handleToggleReminders(!localSettings.enabled)}
            className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${
              localSettings.enabled ? 'bg-primary' : 'bg-surface-300'
            }`}
          >
            <span
              className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                localSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`}
            />
          </button>
        </div>

        {/* Reminder Time */}
        <div className="mb-6 pb-6 border-b border-surface-200">
          <h3 className="font-medium text-surface-900 mb-3">Reminder Time</h3>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Clock" className="w-5 h-5 text-surface-400" />
            <input
              type="time"
              value={localSettings.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={!localSettings.enabled}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Weekdays Only */}
        <div className="mb-6 pb-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-surface-900">Weekdays Only</h3>
              <p className="text-sm text-surface-600">Only send reminders Monday through Friday</p>
            </div>
            <button
              onClick={() => handleWeekdaysToggle(!localSettings.weekdaysOnly)}
              disabled={!localSettings.enabled}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                localSettings.weekdaysOnly ? 'bg-primary' : 'bg-surface-300'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  localSettings.weekdaysOnly ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </button>
          </div>
        </div>

        {/* Test Reminder */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleTestReminder}
            disabled={!localSettings.enabled}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Send" className="w-4 h-4" />
            <span>Send Test Reminder</span>
          </Button>
        </div>
      </motion.div>

      {/* Activity Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-surface-200"
      >
        <h2 className="text-xl font-semibold text-surface-900 mb-6">Reminder Activities</h2>
        <p className="text-surface-600 mb-6">Choose which activities you'd like to be reminded about</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {activityOptions.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                localSettings.activities.includes(activity.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-200 hover:border-surface-300'
              } ${!localSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => localSettings.enabled && handleActivityToggle(activity.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  localSettings.activities.includes(activity.id)
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-600'
                }`}>
                  <ApperIcon name={activity.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-surface-900">{activity.label}</h3>
                  <p className="text-sm text-surface-600">{activity.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  localSettings.activities.includes(activity.id)
                    ? 'border-primary bg-primary'
                    : 'border-surface-300'
                }`}>
                  {localSettings.activities.includes(activity.id) && (
                    <ApperIcon name="Check" className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl p-6 border border-accent/20"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-accent mt-0.5" />
          <div>
            <h3 className="font-semibold text-surface-900 mb-2">Pro Tips</h3>
            <ul className="text-sm text-surface-700 space-y-1">
              <li>• Set reminders for when you're most likely to practice</li>
              <li>• Enable browser notifications for the best experience</li>
              <li>• Mix different activity types to keep learning engaging</li>
              <li>• Consistent daily practice builds stronger habits</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettings;