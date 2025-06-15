import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useUserProgress } from '@/services/userProgressService';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { userProgress } = useUserProgress();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/progress', label: 'Progress', icon: 'TrendingUp' }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <ApperIcon name="Languages" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-surface-900">
                LinguaFlow
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-surface-600 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* XP Display & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* XP Counter */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-accent to-warning px-3 py-1.5 rounded-full">
                <ApperIcon name="Zap" className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">
                  {userProgress?.totalXP || 0} XP
                </span>
              </div>

              {/* Streak Counter */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-error to-warning px-3 py-1.5 rounded-full">
                <ApperIcon name="Flame" className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">
                  {userProgress?.currentStreak || 0}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100"
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-heading font-semibold">Navigation</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-surface-700 hover:bg-surface-50'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-surface-200 px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-500'
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;