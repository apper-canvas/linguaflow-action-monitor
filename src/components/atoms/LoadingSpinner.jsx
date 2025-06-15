import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        <ApperIcon name="Loader2" className={sizes[size]} />
      </motion.div>
      {text && (
        <p className="text-sm text-surface-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;