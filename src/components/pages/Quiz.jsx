import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import quizService from '@/services/api/quizService';
import QuizInterface from '@/components/organisms/QuizInterface';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await quizService.getByLessonId(lessonId);
      setQuiz(result);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setStarted(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" text="Loading quiz..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadQuiz} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message="Quiz not found" />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* Quiz Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
              <ApperIcon name="FileQuestion" className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Quiz Info */}
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-3">
            {quiz.title}
          </h1>
          
          <p className="text-surface-600 mb-8">
            Test your knowledge with {quiz.questions.length} questions
          </p>

          {/* Quiz Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-50 rounded-lg p-4">
              <ApperIcon name="HelpCircle" className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-surface-600">Questions</p>
              <p className="text-lg font-semibold text-surface-900">
                {quiz.questions.length}
              </p>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <ApperIcon name="Target" className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-sm text-surface-600">Passing Score</p>
              <p className="text-lg font-semibold text-surface-900">
                {quiz.passingScore}%
              </p>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <ApperIcon name="Zap" className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-surface-600">XP Reward</p>
              <p className="text-lg font-semibold text-surface-900">
                {quiz.xpReward}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-info/5 border border-info/20 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" className="w-5 h-5 text-info mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-surface-900 mb-2">
                  Quiz Instructions
                </h3>
                <ul className="text-sm text-surface-600 space-y-1">
                  <li>• Choose the best answer for each question</li>
                  <li>• You can navigate between questions</li>
                  <li>• Review your answers before submitting</li>
                  <li>• You need {quiz.passingScore}% to pass</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              icon="ArrowLeft"
            >
              Go Back
            </Button>
            
            <Button
              onClick={handleStartQuiz}
              variant="primary"
              size="lg"
              icon="Play"
            >
              Start Quiz
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quiz Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">
          {quiz.title}
        </h1>
        <p className="text-surface-600">
          Answer all questions to complete the quiz
        </p>
      </motion.div>

      {/* Quiz Interface */}
      <QuizInterface quiz={quiz} />
    </div>
  );
};

export default Quiz;