import Dashboard from '@/components/pages/Dashboard';
import LessonDetail from '@/components/pages/LessonDetail';
import Quiz from '@/components/pages/Quiz';
import Progress from '@/components/pages/Progress';
import Flashcards from '@/components/pages/Flashcards';
import Leaderboard from '@/components/pages/Leaderboard';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Dashboard
  },
  leaderboard: {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: '/leaderboard',
    icon: 'Trophy',
    component: Leaderboard
  },
  lesson: {
    id: 'lesson',
    label: 'Current Lesson',
    path: '/lesson/:courseId/:lessonId',
    icon: 'BookOpen',
    component: LessonDetail
  },
  flashcards: {
    id: 'flashcards',
    label: 'Flashcards',
    path: '/flashcards/:courseId',
    icon: 'Brain',
    component: Flashcards
  },
  quiz: {
    id: 'quiz',
    label: 'Quiz',
    path: '/quiz/:lessonId',
    icon: 'FileQuestion',
    component: Quiz
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  }
};

export const routeArray = Object.values(routes);

export default routes;