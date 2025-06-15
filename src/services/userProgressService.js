import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initial user progress data
const initialProgress = {
  totalXP: 1250,
  currentStreak: 7,
  coursesProgress: {
    'spanish-basics': { completedLessons: 5, totalLessons: 12, xp: 450 },
    'french-intermediate': { completedLessons: 3, totalLessons: 10, xp: 300 },
    'german-beginner': { completedLessons: 8, totalLessons: 15, xp: 500 }
  },
  achievements: [
    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', unlocked: true },
    { id: 'streak-7', name: 'Week Warrior', description: '7-day learning streak', unlocked: true },
    { id: 'xp-1000', name: 'XP Master', description: 'Earn 1000 XP', unlocked: true }
  ]
};

let userProgressData = { ...initialProgress };

export const useUserProgress = () => {
  const [userProgress, setUserProgress] = useState(userProgressData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        await delay(200);
        setUserProgress({ ...userProgressData });
      } catch (err) {
        setError(err.message || 'Failed to load progress');
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  return { userProgress, loading, error };
};

const userProgressService = {
  async get() {
    await delay(200);
    return { ...userProgressData };
  },

  async addXP(amount, source = 'general') {
    await delay(300);
    userProgressData.totalXP += amount;
    
    // Update course-specific XP if source provided
    if (source !== 'general' && userProgressData.coursesProgress[source]) {
      userProgressData.coursesProgress[source].xp += amount;
    }
    
    toast.success(`+${amount} XP earned!`, {
      className: 'bg-gradient-to-r from-accent to-warning text-white'
    });
    
    return { ...userProgressData };
  },

  async updateStreak() {
    await delay(200);
    userProgressData.currentStreak += 1;
    
    if (userProgressData.currentStreak > 0 && userProgressData.currentStreak % 7 === 0) {
      toast.success(`🔥 ${userProgressData.currentStreak}-day streak!`);
    }
    
    return { ...userProgressData };
  },

  async updateCourseProgress(courseId, completedLessons) {
    await delay(250);
    if (userProgressData.coursesProgress[courseId]) {
      userProgressData.coursesProgress[courseId].completedLessons = completedLessons;
    }
    return { ...userProgressData };
  },

  async unlockAchievement(achievementId) {
    await delay(200);
    const achievement = userProgressData.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      toast.success(`🏆 Achievement unlocked: ${achievement.name}!`, {
        autoClose: 5000
      });
    }
    return { ...userProgressData };
  }
};

export default userProgressService;