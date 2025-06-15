import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock speaking exercises data
const mockExercises = [
  {
    id: 'sp-001',
    title: 'Basic Greetings',
    description: 'Practice common greeting phrases',
    text: 'Hello, how are you today? I am fine, thank you.',
    difficulty: 'beginner',
    duration: '30 seconds',
    type: 'greeting',
    language: 'english',
    nativeAudio: '/audio/greetings-native.mp3'
  },
  {
    id: 'sp-002',
    title: 'Restaurant Orders',
    description: 'Learn to order food in a restaurant',
    text: 'I would like to order the chicken pasta with a side salad, please.',
    difficulty: 'intermediate',
    duration: '45 seconds',
    type: 'conversation',
    language: 'english',
    nativeAudio: '/audio/restaurant-native.mp3'
  },
  {
    id: 'sp-003',
    title: 'Directions',
    description: 'Practice asking for and giving directions',
    text: 'Excuse me, could you tell me how to get to the nearest subway station?',
    difficulty: 'intermediate',
    duration: '40 seconds',
    type: 'conversation',
    language: 'english',
    nativeAudio: '/audio/directions-native.mp3'
  },
  {
    id: 'sp-004',
    title: 'Business Introduction',
    description: 'Professional self-introduction',
    text: 'Good morning, my name is Sarah Johnson and I work as a marketing manager at Tech Solutions.',
    difficulty: 'advanced',
    duration: '50 seconds',
    type: 'professional',
    language: 'english',
    nativeAudio: '/audio/business-native.mp3'
  },
  {
    id: 'sp-005',
    title: 'Weather Conversation',
    description: 'Discuss weather conditions',
    text: 'The weather is beautiful today. It is sunny and warm with a gentle breeze.',
    difficulty: 'beginner',
    duration: '35 seconds',
    type: 'conversation',
    language: 'english',
    nativeAudio: '/audio/weather-native.mp3'
  },
  {
    id: 'sp-006',
    title: 'Shopping Experience',
    description: 'Practice shopping conversations',
    text: 'Excuse me, where can I find the electronics section? I am looking for a new smartphone.',
    difficulty: 'intermediate',
    duration: '40 seconds',
    type: 'conversation',
    language: 'english',
    nativeAudio: '/audio/shopping-native.mp3'
  }
];

// Mock user speaking progress
let userSpeakingProgress = {
  completedExercises: [],
  averageScore: 0,
  totalAttempts: 0,
  bestScores: {}
};

const speakingPracticeService = {
  async getExercises(difficulty = null, language = 'english') {
    await delay(300);
    let exercises = [...mockExercises];
    
    if (difficulty) {
      exercises = exercises.filter(ex => ex.difficulty === difficulty);
    }
    
    if (language) {
      exercises = exercises.filter(ex => ex.language === language);
    }
    
    return exercises;
  },

  async getExerciseById(id) {
    await delay(200);
    const exercise = mockExercises.find(ex => ex.id === id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return { ...exercise };
  },

  async analyzeAudio(audioBlob, exerciseId) {
    await delay(2000); // Simulate audio processing time
    
    const exercise = mockExercises.find(ex => ex.id === exerciseId);
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // Simulate pronunciation analysis
    const baseScore = 70 + Math.random() * 25; // Random score between 70-95
    const pronunciationScore = Math.round(baseScore + (Math.random() - 0.5) * 10);
    const fluencyScore = Math.round(baseScore + (Math.random() - 0.5) * 8);
    const clarityScore = Math.round(baseScore + (Math.random() - 0.5) * 12);
    const overallScore = Math.round((pronunciationScore + fluencyScore + clarityScore) / 3);

    const analysis = {
      exerciseId,
      overallScore: Math.max(0, Math.min(100, overallScore)),
      detailedScores: [
        {
          category: 'Pronunciation',
          value: Math.max(0, Math.min(100, pronunciationScore)),
          description: 'Accuracy of individual sound production'
        },
        {
          category: 'Fluency',
          value: Math.max(0, Math.min(100, fluencyScore)),
          description: 'Smoothness and natural flow of speech'
        },
        {
          category: 'Clarity',
          value: Math.max(0, Math.min(100, clarityScore)),
          description: 'Overall intelligibility and articulation'
        }
      ],
      feedback: this.generateFeedback(overallScore, pronunciationScore, fluencyScore, clarityScore),
      recommendations: this.generateRecommendations(overallScore),
      comparedToNative: Math.round(overallScore * 0.9), // Slightly lower than overall score
      recordingDuration: Math.round(audioBlob.size / 16000), // Approximate duration
      timestamp: new Date().toISOString()
    };

    // Update user progress
    userSpeakingProgress.totalAttempts += 1;
    userSpeakingProgress.averageScore = Math.round(
      (userSpeakingProgress.averageScore * (userSpeakingProgress.totalAttempts - 1) + overallScore) / 
      userSpeakingProgress.totalAttempts
    );

    // Track best score for this exercise
    if (!userSpeakingProgress.bestScores[exerciseId] || 
        userSpeakingProgress.bestScores[exerciseId] < overallScore) {
      userSpeakingProgress.bestScores[exerciseId] = overallScore;
    }

    // Add to completed exercises if not already there
    if (!userSpeakingProgress.completedExercises.includes(exerciseId)) {
      userSpeakingProgress.completedExercises.push(exerciseId);
    }

    return analysis;
  },

  generateFeedback(overall, pronunciation, fluency, clarity) {
    if (overall >= 90) {
      return "Excellent pronunciation! Your speech is very clear and natural. You sound almost native-like. Keep up the great work!";
    } else if (overall >= 80) {
      return "Great job! Your pronunciation is quite good. Focus on maintaining consistency across all sounds and continue practicing for even better results.";
    } else if (overall >= 70) {
      return "Good effort! Your pronunciation is understandable with some areas for improvement. Practice specific sounds that need work and focus on rhythm and intonation.";
    } else if (overall >= 60) {
      return "You're making progress! Work on clearer articulation and slower speech initially. Regular practice will help improve your pronunciation significantly.";
    } else {
      return "Keep practicing! Focus on individual sounds first, then work on connecting them smoothly. Consider listening to native speakers more and mimicking their pronunciation.";
    }
  },

  generateRecommendations(score) {
    const recommendations = [];
    
    if (score < 70) {
      recommendations.push("Practice individual sounds using phonetic exercises");
      recommendations.push("Listen to native speakers and try to mimic their pronunciation");
      recommendations.push("Record yourself regularly to track improvement");
    } else if (score < 85) {
      recommendations.push("Focus on intonation and stress patterns");
      recommendations.push("Practice connected speech and linking words");
      recommendations.push("Work on rhythm and natural flow");
    } else {
      recommendations.push("Maintain your excellent pronunciation");
      recommendations.push("Challenge yourself with more complex texts");
      recommendations.push("Help others improve their pronunciation");
    }
    
    return recommendations;
  },

  async getUserProgress() {
    await delay(200);
    return { ...userSpeakingProgress };
  },

  async getLeaderboard() {
    await delay(300);
    // Mock leaderboard data for speaking practice
    return [
      { id: 1, name: 'Emma Rodriguez', avatar: '👩‍💼', score: 92, exercises: 48 },
      { id: 2, name: 'Chen Wei', avatar: '👨‍💻', score: 88, exercises: 52 },
      { id: 3, name: 'Aisha Patel', avatar: '👩‍🎓', score: 90, exercises: 45 },
      { id: 4, name: 'You', avatar: '👤', score: userSpeakingProgress.averageScore, exercises: userSpeakingProgress.totalAttempts, isCurrentUser: true },
      { id: 5, name: 'Sofia Rossi', avatar: '👩‍🎨', score: 89, exercises: 41 }
    ].sort((a, b) => b.score - a.score);
  },

  async saveProgress(exerciseId, score, analysis) {
    await delay(250);
    
    const progressEntry = {
      exerciseId,
      score,
      analysis,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would save to backend
    toast.success('Progress saved successfully!');
    
    return progressEntry;
  },

  // Check if browser supports Web Speech API
  isSpeechRecognitionSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  // Check if browser supports MediaRecorder
  isMediaRecorderSupported() {
    return 'MediaRecorder' in window;
  },

  // Get supported audio formats
  getSupportedAudioFormats() {
    const formats = [];
    const testAudio = document.createElement('audio');
    
    if (testAudio.canPlayType('audio/mp3')) formats.push('mp3');
    if (testAudio.canPlayType('audio/wav')) formats.push('wav');
    if (testAudio.canPlayType('audio/ogg')) formats.push('ogg');
    
    return formats;
  }
};

export default speakingPracticeService;