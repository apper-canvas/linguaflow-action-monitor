import React from 'react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '@/services/userProgressService';
import ApperIcon from '@/components/ApperIcon';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';

const Leaderboard = () => {
  const { leaderboard, loading, error } = useLeaderboard();

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} />
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '👑', color: 'from-yellow-400 to-orange-500', text: 'text-white' };
    if (rank === 2) return { icon: '🥈', color: 'from-gray-300 to-gray-500', text: 'text-white' };
    if (rank === 3) return { icon: '🥉', color: 'from-orange-300 to-orange-600', text: 'text-white' };
    return { icon: '#' + rank, color: 'from-surface-100 to-surface-200', text: 'text-surface-700' };
  };

  const getXPBarColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-300 to-orange-600';
    if (rank <= 5) return 'from-primary to-secondary';
    return 'from-surface-300 to-surface-400';
  };

  const maxWeeklyXP = leaderboard.length > 0 ? leaderboard[0].weeklyXP : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-surface-900">
            Weekly Leaderboard
          </h1>
        </div>
        <p className="text-lg text-surface-600">
          Top learners this week • Updated daily
        </p>
      </motion.div>

      {/* Leaderboard */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {leaderboard.map((user, index) => {
            const badge = getRankBadge(user.rank);
            const xpBarColor = getXPBarColor(user.rank);
            const xpPercentage = (user.weeklyXP / maxWeeklyXP) * 100;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-white rounded-xl shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
                  user.isCurrentUser 
                    ? 'border-primary bg-gradient-to-r from-primary/5 to-secondary/5' 
                    : 'border-transparent hover:border-surface-200'
                }`}
              >
                {/* XP Progress Bar Background */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${xpBarColor} opacity-10 transition-all duration-500`}
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    {/* Left side - Rank, Avatar, User Info */}
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center font-bold ${badge.text} shadow-md`}>
                        {badge.icon}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${user.isCurrentUser ? 'text-primary' : 'text-surface-900'}`}>
                            {user.name}
                          </h3>
                          {user.isCurrentUser && (
                            <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-surface-600">
                            {user.languages?.join(', ')}
                          </p>
                          <div className="hidden sm:flex items-center space-x-1 text-surface-500">
                            <ApperIcon name="Star" className="w-3 h-3" />
                            <span className="text-xs">{user.totalXP.toLocaleString()} total XP</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Weekly XP */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Zap" className="w-5 h-5 text-accent" />
                        <span className="text-xl font-bold text-surface-900">
                          {user.weeklyXP.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-surface-500">this week</p>
                    </div>
                  </div>

                  {/* Mobile: Total XP */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-surface-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600">Total XP</span>
                      <span className="font-medium text-surface-900">
                        {user.totalXP.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Footer Info */}
      {!loading && leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-surface-50 rounded-lg"
        >
          <div className="flex items-center space-x-2 text-surface-600">
            <ApperIcon name="Info" className="w-4 h-4" />
            <p className="text-sm">
              Rankings are based on XP earned this week. Keep learning to climb higher!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;