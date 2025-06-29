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
  speakingProgress: {
    totalPractices: 12,
    averageScore: 85,
    streakDays: 3,
    completedExercises: 24,
    pronunciationImprovement: 15
  },
  achievements: [
    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', unlocked: true },
    { id: 'streak-7', name: 'Week Warrior', description: '7-day learning streak', unlocked: true },
    { id: 'xp-1000', name: 'XP Master', description: 'Earn 1000 XP', unlocked: true },
    { id: 'first-recording', name: 'Voice Activated', description: 'Complete your first speaking exercise', unlocked: true },
    { id: 'pronunciation-80', name: 'Clear Speaker', description: 'Achieve 80% pronunciation accuracy', unlocked: true }
],
  dailyPractice: {
    lastPracticeDate: null,
    todayCompleted: false,
    remindersSent: 0,
    preferredReminderTime: '19:00',
    enabledActivities: ['lessons', 'flashcards', 'speaking']
  }
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

  async updateSpeakingProgress(score, exerciseType) {
    await delay(300);
    if (!userProgressData.speakingProgress) {
      userProgressData.speakingProgress = {
        totalPractices: 0,
        averageScore: 0,
        streakDays: 0,
        completedExercises: 0,
        pronunciationImprovement: 0
      };
    }
    
    const speaking = userProgressData.speakingProgress;
    speaking.totalPractices += 1;
    speaking.completedExercises += 1;
    speaking.averageScore = Math.round(
      (speaking.averageScore * (speaking.totalPractices - 1) + score) / speaking.totalPractices
    );
    
    // Award XP based on performance
    const xpEarned = Math.max(10, Math.round(score / 5));
    userProgressData.totalXP += xpEarned;
    
    toast.success(`Speaking practice complete! +${xpEarned} XP`, {
      className: 'bg-gradient-to-r from-accent to-warning text-white'
    });
    
    // Check for achievements
    if (score >= 80 && !userProgressData.achievements.find(a => a.id === 'pronunciation-80')?.unlocked) {
      await this.unlockAchievement('pronunciation-80');
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
  },

  async markDailyPracticeComplete() {
    await delay(200);
    const today = new Date().toDateString();
    userProgressData.dailyPractice.lastPracticeDate = today;
    userProgressData.dailyPractice.todayCompleted = true;
    userProgressData.dailyPractice.remindersSent = 0;
    
    toast.success('Daily practice complete! Keep up the great work! 🎉', {
      className: 'bg-gradient-to-r from-success to-accent text-white'
    });
    
    return { ...userProgressData };
  },

  async updateReminderPreferences(preferences) {
    await delay(200);
    userProgressData.dailyPractice = {
      ...userProgressData.dailyPractice,
      ...preferences
    };
    
    toast.success('Reminder preferences updated!');
    return { ...userProgressData };
  }
};
// Mock leaderboard data
const mockLeaderboardData = [
  { id: 1, name: 'Emma Rodriguez', avatar: '👩‍💼', weeklyXP: 2450, totalXP: 15670, rank: 1, languages: ['Spanish', 'French'], speakingScore: 92 },
  { id: 2, name: 'Chen Wei', avatar: '👨‍💻', weeklyXP: 2380, totalXP: 18920, rank: 2, languages: ['Mandarin', 'English'], speakingScore: 88 },
  { id: 3, name: 'Aisha Patel', avatar: '👩‍🎓', weeklyXP: 2220, totalXP: 14350, rank: 3, languages: ['Hindi', 'German'], speakingScore: 90 },
  { id: 4, name: 'Marcus Johnson', avatar: '👨‍🏫', weeklyXP: 1980, totalXP: 12450, rank: 4, languages: ['English', 'Spanish'], speakingScore: 86 },
  { id: 5, name: 'Sofia Rossi', avatar: '👩‍🎨', weeklyXP: 1850, totalXP: 13200, rank: 5, languages: ['Italian', 'French'], speakingScore: 89 },
  { id: 6, name: 'You', avatar: '👤', weeklyXP: 1250, totalXP: 1250, rank: 6, languages: ['Spanish', 'French', 'German'], isCurrentUser: true, speakingScore: 85 },
  { id: 7, name: 'Dmitri Volkov', avatar: '👨‍🔬', weeklyXP: 1180, totalXP: 9800, rank: 7, languages: ['Russian', 'English'], speakingScore: 82 },
  { id: 8, name: 'Fatima Al-Zahra', avatar: '👩‍⚕️', weeklyXP: 1050, totalXP: 8650, rank: 8, languages: ['Arabic', 'French'], speakingScore: 87 },
  { id: 9, name: 'Hiroshi Tanaka', avatar: '👨‍💼', weeklyXP: 920, totalXP: 7430, rank: 9, languages: ['Japanese', 'English'], speakingScore: 84 },
  { id: 10, name: 'Isabella Santos', avatar: '👩‍🏫', weeklyXP: 840, totalXP: 6890, rank: 10, languages: ['Portuguese', 'Spanish'], speakingScore: 83 }
];
export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        await delay(300);
        setLeaderboard([...mockLeaderboardData]);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  return { leaderboard, loading, error };
};

const leaderboardService = {
  async getWeeklyRankings() {
    await delay(300);
    return [...mockLeaderboardData];
  },

  async getUserRank(userId = 6) {
    await delay(200);
    const user = mockLeaderboardData.find(u => u.id === userId);
    return user ? { ...user } : null;
  },

  async getTopPerformers(limit = 3) {
    await delay(250);
    return [...mockLeaderboardData].slice(0, limit);
  }
};

export { leaderboardService };

export default userProgressService;