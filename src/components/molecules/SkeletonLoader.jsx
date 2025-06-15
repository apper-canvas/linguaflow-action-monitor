import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'course' }) => {
  const renderCourseSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-surface-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-surface-200 rounded w-24 animate-pulse" />
            <div className="h-4 bg-surface-200 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="w-15 h-15 bg-surface-200 rounded-full animate-pulse" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-surface-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-surface-200 rounded w-3/4 animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-surface-200 rounded w-20 animate-pulse" />
        <div className="h-4 bg-surface-200 rounded w-16 animate-pulse" />
      </div>
    </div>
  );

  const renderLessonSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-surface-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-surface-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-surface-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="w-6 h-6 bg-surface-200 rounded animate-pulse" />
      </div>
    </div>
  );

  const renderFlashcardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="text-center space-y-4">
        <div className="h-8 bg-surface-200 rounded w-32 mx-auto animate-pulse" />
        <div className="h-6 bg-surface-200 rounded w-24 mx-auto animate-pulse" />
      </div>
    </div>
  );

  const skeletons = {
    course: renderCourseSkeleton,
    lesson: renderLessonSkeleton,
    flashcard: renderFlashcardSkeleton
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {skeletons[type]()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;