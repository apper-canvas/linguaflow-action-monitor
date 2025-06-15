import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import flashcardService from '@/services/api/flashcardService';
import userProgressService from '@/services/userProgressService';
import FlashcardComponent from '@/components/molecules/FlashcardComponent';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Flashcards = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    total: 0
  });

  useEffect(() => {
    loadFlashcards();
  }, [courseId]);

  const loadFlashcards = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await flashcardService.getByCourseId(courseId);
      setFlashcards(result);
      setSessionStats(prev => ({ ...prev, total: result.length }));
    } catch (err) {
      setError(err.message || 'Failed to load flashcards');
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (flashcardId, difficulty) => {
    try {
      await flashcardService.updateDifficulty(flashcardId, difficulty);
      
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        correct: difficulty >= 3 ? prev.correct + 1 : prev.correct
      }));

      // Add XP based on difficulty rating
      const xpGain = difficulty >= 3 ? 5 : 2;
      await userProgressService.addXP(xpGain, courseId);

      // Move to next card or complete session
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        completeSession();
      }
    } catch (err) {
      toast.error('Failed to update flashcard');
    }
  };

  const completeSession = () => {
    setSessionComplete(true);
    const accuracy = sessionStats.total > 0 
      ? Math.round(((sessionStats.correct + 1) / (sessionStats.reviewed + 1)) * 100)
      : 0;
    
    toast.success(`🎉 Session complete! ${accuracy}% accuracy`, {
      className: 'bg-gradient-to-r from-success to-primary text-white',
      autoClose: 4000
    });
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSessionComplete(false);
    setSessionStats({
      reviewed: 0,
      correct: 0,
      total: flashcards.length
    });
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSkip = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeSession();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" text="Loading flashcards..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadFlashcards} />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          title="No flashcards available"
          description="Complete lessons to unlock vocabulary flashcards"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
          icon="Brain"
        />
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = sessionStats.total > 0 
      ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
      : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-heading font-bold text-surface-900 mb-4">
            Great Job! 🎉
          </h2>
          
          <p className="text-lg text-surface-600 mb-8">
            You completed the flashcard session
          </p>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-primary">
                {sessionStats.reviewed}
              </p>
              <p className="text-sm text-surface-600">Cards Reviewed</p>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-success">
                {accuracy}%
              </p>
              <p className="text-sm text-surface-600">Accuracy</p>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-accent">
                {sessionStats.reviewed * 3}
              </p>
              <p className="text-sm text-surface-600">XP Earned</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRestart}
              variant="outline"
              icon="RotateCcw"
            >
              Practice Again
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="primary"
              icon="Home"
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          Flashcard Practice
        </h1>
        <p className="text-surface-600">
          Review vocabulary with spaced repetition
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-surface-600">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm font-medium text-surface-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="bg-surface-200 rounded-full h-2">
          <motion.div
            className="gradient-primary rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Flashcard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardComponent
              flashcard={currentCard}
              onRate={handleRate}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Session Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h3 className="font-heading font-semibold text-surface-900 mb-4">
          Session Progress
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {sessionStats.reviewed}
            </p>
            <p className="text-sm text-surface-600">Reviewed</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {sessionStats.correct}
            </p>
            <p className="text-sm text-surface-600">Correct</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-surface-600">
              {sessionStats.total - currentIndex - 1}
            </p>
            <p className="text-sm text-surface-600">Remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          icon="X"
        >
          End Session
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="outline"
          icon="SkipForward"
        >
          Skip Card
        </Button>
      </div>
    </div>
  );
};

export default Flashcards;