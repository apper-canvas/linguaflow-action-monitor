import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/lesson/${course.id}/spanish-1`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer card-hover"
      onClick={handleCourseClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{course.iconUrl}</div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-surface-900">
                {course.language}
              </h3>
              <p className="text-sm text-surface-500">{course.level}</p>
            </div>
          </div>
          <ProgressRing 
            progress={course.progress} 
            size={60} 
            strokeWidth={6}
            color={course.color}
          />
        </div>

        <p className="text-surface-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-surface-500">
              <ApperIcon name="BookOpen" className="w-4 h-4" />
              <span className="text-sm">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
            </div>
          </div>
          
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center space-x-1 text-primary"
          >
            <span className="text-sm font-medium">Continue</span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;