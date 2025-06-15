import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserProgress } from '@/services/userProgressService';
import courseService from '@/services/api/courseService';
import ProgressRing from '@/components/atoms/ProgressRing';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import Chart from 'react-apexcharts';

const Progress = () => {
  const { userProgress, loading: progressLoading } = useUserProgress();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getAll();
      setCourses(result);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (progressLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" text="Loading progress..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadCourses} />
      </div>
    );
  }

  // Chart configuration for XP progress
  const xpChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#6366F1'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light'
    }
  };

  const xpChartSeries = [{
    name: 'XP Earned',
    data: [45, 32, 68, 55, 41, 87, 65] // Mock weekly data
  }];

  const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0);
  const completedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          Your Progress
        </h1>
        <p className="text-surface-600">
          Track your learning journey and achievements
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Overall Progress
            </h3>
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
          </div>
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={overallProgress}
              size={80}
              strokeWidth={8}
              color="#6366F1"
            />
          </div>
          <p className="text-center text-sm text-surface-600 mt-3">
            {completedLessons} of {totalLessons} lessons
          </p>
        </div>

        {/* Total XP */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Total XP
            </h3>
            <ApperIcon name="Zap" className="w-6 h-6 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent mb-2">
              {userProgress?.totalXP || 0}
            </p>
            <p className="text-sm text-surface-600">
              Experience Points
            </p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Current Streak
            </h3>
            <ApperIcon name="Flame" className="w-6 h-6 text-error" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-error mb-2">
              {userProgress?.currentStreak || 0}
            </p>
            <p className="text-sm text-surface-600">
              Days in a row
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Achievements
            </h3>
            <ApperIcon name="Trophy" className="w-6 h-6 text-warning" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning mb-2">
              {userProgress?.achievements?.filter(a => a.unlocked).length || 0}
            </p>
            <p className="text-sm text-surface-600">
              Unlocked badges
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* XP Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
            Weekly XP Progress
          </h3>
          <Chart
            options={xpChartOptions}
            series={xpChartSeries}
            type="area"
            height={300}
          />
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
            Course Progress
          </h3>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="text-2xl">{course.iconUrl}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-surface-900">
                      {course.language}
                    </h4>
                    <span className="text-sm text-surface-600">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <div className="bg-surface-200 rounded-full h-2">
                    <motion.div
                      className="rounded-full h-2"
                      style={{ backgroundColor: course.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-surface-900">
                  {course.progress}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      {userProgress?.achievements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
            Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  achievement.unlocked
                    ? 'border-success bg-success/5'
                    : 'border-surface-200 bg-surface-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-success text-white'
                      : 'bg-surface-300 text-surface-600'
                  }`}>
                    <ApperIcon name="Trophy" className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? 'text-surface-900' : 'text-surface-500'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-surface-600' : 'text-surface-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Progress;