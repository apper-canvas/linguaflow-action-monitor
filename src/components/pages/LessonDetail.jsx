import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import lessonService from '@/services/api/lessonService';
import userProgressService from '@/services/userProgressService';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await lessonService.getById(lessonId);
      setLesson(result);
    } catch (err) {
      setError(err.message || 'Failed to load lesson');
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson || lesson.completed) return;
    
    setCompleting(true);
    try {
      // Mark lesson as complete
      await lessonService.markComplete(lesson.id);
      
      // Add XP for lesson completion
      await userProgressService.addXP(25, courseId);
      
      // Update local state
      setLesson({ ...lesson, completed: true });
      
      toast.success('🎉 Lesson completed! Great job!', {
        className: 'bg-gradient-to-r from-success to-primary text-white'
      });
    } catch (err) {
      toast.error('Failed to complete lesson');
    } finally {
      setCompleting(false);
    }
  };

  const handleTakeQuiz = () => {
    navigate(`/quiz/${lessonId}`);
  };

  const handlePracticeFlashcards = () => {
    navigate(`/flashcards/${courseId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" text="Loading lesson..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadLesson} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message="Lesson not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-surface-600 mb-6"
      >
        <button
          onClick={() => navigate('/')}
          className="hover:text-primary transition-colors"
        >
          Dashboard
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <button
          onClick={() => navigate('/')}
          className="hover:text-primary transition-colors capitalize"
        >
          {courseId?.replace('-', ' ')}
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-surface-900 font-medium">{lesson.title}</span>
      </motion.nav>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <VideoPlayer lesson={lesson} onComplete={handleCompleteLesson} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {/* Complete Lesson */}
        <Button
          onClick={handleCompleteLesson}
          variant={lesson.completed ? "success" : "primary"}
          disabled={lesson.completed || completing}
          loading={completing}
          icon={lesson.completed ? "CheckCircle" : "PlayCircle"}
          className="w-full"
        >
          {lesson.completed ? 'Completed' : 'Mark Complete'}
        </Button>

        {/* Take Quiz */}
        <Button
          onClick={handleTakeQuiz}
          variant="secondary"
          icon="FileQuestion"
          className="w-full"
        >
          Take Quiz
        </Button>

        {/* Practice Flashcards */}
        <Button
          onClick={handlePracticeFlashcards}
          variant="outline"
          icon="Brain"
          className="w-full"
        >
          Practice Vocabulary
        </Button>
      </motion.div>

      {/* Vocabulary Section */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-heading font-bold text-surface-900 mb-6">
            Lesson Vocabulary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-surface-50 rounded-lg p-4 hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-surface-900 text-lg">
                      {word.word}
                    </h4>
                    <p className="text-surface-600 mb-1">
                      {word.translation}
                    </p>
                    <p className="text-sm text-surface-500 italic">
                      {word.pronunciation}
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-surface-200 text-primary"
                  >
                    <ApperIcon name="Volume2" className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LessonDetail;