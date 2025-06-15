import React from 'react';
import { motion } from 'framer-motion';
import CourseGrid from '@/components/organisms/CourseGrid';
import { useUserProgress } from '@/services/userProgressService';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  const { userProgress, loading } = useUserProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-surface-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-surface-600">
          Continue your language learning journey
        </p>
      </motion.div>

      {/* Stats Cards */}
      {!loading && userProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          {/* Total XP */}
          <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total XP</p>
                <p className="text-2xl font-bold">{userProgress.totalXP}</p>
              </div>
              <ApperIcon name="Zap" className="w-8 h-8 text-white/80" />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-gradient-to-br from-accent to-warning p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Day Streak</p>
                <p className="text-2xl font-bold">{userProgress.currentStreak}</p>
              </div>
              <ApperIcon name="Flame" className="w-8 h-8 text-white/80" />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-success to-info p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Achievements</p>
                <p className="text-2xl font-bold">
                  {userProgress.achievements?.filter(a => a.unlocked).length || 0}
                </p>
              </div>
              <ApperIcon name="Trophy" className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Courses Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-surface-900">
            Your Courses
          </h2>
          <div className="flex items-center space-x-2 text-surface-600">
            <ApperIcon name="BookOpen" className="w-5 h-5" />
            <span className="text-sm font-medium">
              {userProgress ? Object.keys(userProgress.coursesProgress || {}).length : 0} active
            </span>
          </div>
        </div>

        <CourseGrid />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-heading font-bold text-surface-900 mb-6">
          Quick Practice
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 border-transparent hover:border-primary/20"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Brain" className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-surface-900">Flashcards</h3>
            </div>
            <p className="text-sm text-surface-600">
              Review vocabulary with spaced repetition
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 border-transparent hover:border-secondary/20"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileQuestion" className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-surface-900">Quick Quiz</h3>
            </div>
            <p className="text-sm text-surface-600">
              Test your knowledge with random questions
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 border-transparent hover:border-accent/20"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Volume2" className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-surface-900">Pronunciation</h3>
            </div>
            <p className="text-sm text-surface-600">
              Practice speaking with audio exercises
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 border-transparent hover:border-success/20"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold text-surface-900">Progress</h3>
            </div>
            <p className="text-sm text-surface-600">
              View detailed learning statistics
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;