import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import quizService from '@/services/api/quizService';
import userProgressService from '@/services/userProgressService';
import { toast } from 'react-toastify';

const QuizInterface = ({ quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswerSelect = (answerIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const answerArray = quiz.questions.map((_, index) => answers[index]);
      const quizResults = await quizService.submitQuiz(quiz.id, answerArray);
      setResults(quizResults);
      
      // Add XP to user progress
      if (quizResults.xpEarned > 0) {
        await userProgressService.addXP(quizResults.xpEarned, 'quiz');
      }
      
      setShowResults(true);
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const handleFinish = () => {
    navigate('/progress');
  };

  const currentQuestionData = quiz.questions[currentQuestion];
  const isAnswered = answers.hasOwnProperty(currentQuestion);
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Results Header */}
          <div className="mb-8">
            {results.passed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <ApperIcon name="Trophy" className="w-20 h-20 text-accent mx-auto mb-4" />
              </motion.div>
            ) : (
              <ApperIcon name="AlertCircle" className="w-20 h-20 text-warning mx-auto mb-4" />
            )}
            
            <h2 className="text-3xl font-heading font-bold text-surface-900 mb-2">
              {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            
            <p className="text-lg text-surface-600">
              You scored {results.score}% ({results.correctAnswers}/{results.totalQuestions} correct)
            </p>
          </div>

          {/* XP Earned */}
          {results.xpEarned > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent to-warning text-white px-6 py-3 rounded-full mb-6"
            >
              <ApperIcon name="Zap" className="w-5 h-5" />
              <span className="font-semibold">+{results.xpEarned} XP</span>
            </motion.div>
          )}

          {/* Detailed Results */}
          <div className="bg-surface-50 rounded-lg p-6 mb-8">
            <h3 className="font-heading font-semibold text-surface-900 mb-4">
              Question Review
            </h3>
            <div className="space-y-3">
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.isCorrect ? 'bg-success/10' : 'bg-error/10'
                  }`}
                >
                  <span className="text-sm text-surface-700">
                    Question {index + 1}
                  </span>
                  <ApperIcon
                    name={result.isCorrect ? "CheckCircle" : "XCircle"}
                    className={`w-5 h-5 ${
                      result.isCorrect ? 'text-success' : 'text-error'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!results.passed && (
              <Button
                onClick={handleRetakeQuiz}
                variant="outline"
                icon="RotateCcw"
              >
                Retake Quiz
              </Button>
            )}
            
            <Button
              onClick={handleFinish}
              variant="primary"
              icon="TrendingUp"
            >
              View Progress
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-surface-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
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
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-surface-200 hover:border-surface-300 text-surface-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-primary bg-primary'
                      : 'border-surface-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <ApperIcon name="Check" className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          variant="ghost"
          disabled={currentQuestion === 0}
          icon="ChevronLeft"
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          variant="primary"
          disabled={!isAnswered}
          loading={loading}
          icon={currentQuestion === quiz.questions.length - 1 ? "CheckCircle" : "ChevronRight"}
          iconPosition="right"
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuizInterface;