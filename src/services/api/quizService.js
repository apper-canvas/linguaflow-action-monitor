import quizzesData from '../mockData/quizzes.json';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const quizService = {
  async getAll() {
    await delay(300);
    return [...quizzesData];
  },

  async getById(id) {
    await delay(250);
    const quiz = quizzesData.find(quiz => quiz.id === id);
    if (!quiz) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    return { ...quiz };
  },

  async getByLessonId(lessonId) {
    await delay(300);
    const quiz = quizzesData.find(quiz => quiz.lessonId === lessonId);
    if (!quiz) {
      throw new Error(`Quiz for lesson ${lessonId} not found`);
    }
    return { ...quiz };
  },

  async submitQuiz(quizId, answers) {
    await delay(500);
    const quiz = quizzesData.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }

    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    
    if (passed) {
      toast.success(`🎉 Quiz passed! Score: ${score}%`, {
        className: 'bg-gradient-to-r from-success to-primary text-white',
        autoClose: 4000
      });
    } else {
      toast.warning(`Quiz score: ${score}%. Keep practicing!`, {
        autoClose: 4000
      });
    }

    return {
      quizId,
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      xpEarned: passed ? quiz.xpReward : Math.floor(quiz.xpReward / 2),
      results
    };
  },

  async create(quizData) {
    await delay(400);
    const newQuiz = {
      ...quizData,
      id: `quiz-${Date.now()}`
    };
    quizzesData.push(newQuiz);
    toast.success('Quiz created successfully!');
    return { ...newQuiz };
  },

  async update(id, updates) {
    await delay(350);
    const quizIndex = quizzesData.findIndex(quiz => quiz.id === id);
    if (quizIndex === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    quizzesData[quizIndex] = { ...quizzesData[quizIndex], ...updates };
    toast.success('Quiz updated successfully!');
    return { ...quizzesData[quizIndex] };
  },

  async delete(id) {
    await delay(300);
    const quizIndex = quizzesData.findIndex(quiz => quiz.id === id);
    if (quizIndex === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    quizzesData.splice(quizIndex, 1);
    toast.success('Quiz deleted successfully!');
    return true;
  }
};

export default quizService;