import lessonsData from '../mockData/lessons.json';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const lessonService = {
  async getAll() {
    await delay(300);
    return [...lessonsData];
  },

  async getById(id) {
    await delay(250);
    const lesson = lessonsData.find(lesson => lesson.id === id);
    if (!lesson) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    return { ...lesson };
  },

  async getByCourseId(courseId) {
    await delay(300);
    return lessonsData.filter(lesson => lesson.courseId === courseId);
  },

  async create(lessonData) {
    await delay(400);
    const newLesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      completed: false
    };
    lessonsData.push(newLesson);
    toast.success('Lesson created successfully!');
    return { ...newLesson };
  },

  async update(id, updates) {
    await delay(350);
    const lessonIndex = lessonsData.findIndex(lesson => lesson.id === id);
    if (lessonIndex === -1) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    lessonsData[lessonIndex] = { ...lessonsData[lessonIndex], ...updates };
    
    if (updates.completed) {
      toast.success('Lesson completed! 🎉', {
        className: 'bg-gradient-to-r from-success to-primary text-white'
      });
    }
    
    return { ...lessonsData[lessonIndex] };
  },

  async markComplete(id) {
    await delay(300);
    return this.update(id, { completed: true });
  },

  async delete(id) {
    await delay(300);
    const lessonIndex = lessonsData.findIndex(lesson => lesson.id === id);
    if (lessonIndex === -1) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    lessonsData.splice(lessonIndex, 1);
toast.success('Lesson deleted successfully!');
    return true;
  },

  // Download Management
  async downloadVideo(lessonId) {
    await delay(200);
    const lesson = lessonsData.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} not found`);
    }

    // Check storage availability
    if (!this.checkStorageAvailable()) {
      throw new Error('Insufficient storage space for download');
    }

    try {
      // Simulate download process
      const downloadKey = `download_${lessonId}`;
      
      // Mark as downloading
      this.updateDownloadStatus(lessonId, 'downloading', 0);
      
      // Simulate progressive download with progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await delay(300);
        this.updateDownloadStatus(lessonId, 'downloading', progress);
      }
      
      // Mark as completed
      this.updateDownloadStatus(lessonId, 'completed', 100);
      
      // Store download info
      const downloads = this.getDownloads();
      downloads[lessonId] = {
        lessonId,
        title: lesson.title,
        downloadedAt: new Date().toISOString(),
        size: lesson.estimatedSize || '150MB',
        videoUrl: lesson.videoUrl
      };
      localStorage.setItem('linguaflow_downloads', JSON.stringify(downloads));
      
      toast.success(`"${lesson.title}" downloaded successfully! 📱`);
      return { success: true, lessonId };
    } catch (error) {
      this.updateDownloadStatus(lessonId, 'error', 0);
      throw error;
    }
  },

  async removeDownload(lessonId) {
    await delay(200);
    const downloads = this.getDownloads();
    
    if (downloads[lessonId]) {
      delete downloads[lessonId];
      localStorage.setItem('linguaflow_downloads', JSON.stringify(downloads));
      
      // Clear download status
      const statusKey = `download_status_${lessonId}`;
      localStorage.removeItem(statusKey);
      
      const lesson = lessonsData.find(l => l.id === lessonId);
      toast.success(`"${lesson?.title || 'Lesson'}" removed from downloads`);
      return { success: true };
    }
    
    throw new Error('Download not found');
  },

  getDownloads() {
    try {
      return JSON.parse(localStorage.getItem('linguaflow_downloads') || '{}');
    } catch {
      return {};
    }
  },

  getDownloadStatus(lessonId) {
    try {
      const statusKey = `download_status_${lessonId}`;
      return JSON.parse(localStorage.getItem(statusKey) || 'null');
    } catch {
      return null;
    }
  },

  updateDownloadStatus(lessonId, status, progress = 0) {
    const statusKey = `download_status_${lessonId}`;
    const statusData = {
      status, // 'downloading', 'completed', 'error'
      progress,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(statusKey, JSON.stringify(statusData));
  },

  isDownloaded(lessonId) {
    const downloads = this.getDownloads();
    return !!downloads[lessonId];
  },

  checkStorageAvailable() {
    // Simple storage check - in real app would check actual device storage
    const downloads = this.getDownloads();
    const downloadCount = Object.keys(downloads).length;
    return downloadCount < 50; // Limit to 50 downloads
  },

  getStorageInfo() {
    const downloads = this.getDownloads();
    const downloadCount = Object.keys(downloads).length;
    const estimatedUsage = downloadCount * 150; // 150MB per lesson estimate
    
    return {
      downloadCount,
      estimatedUsage: `${estimatedUsage}MB`,
      availableSlots: Math.max(0, 50 - downloadCount)
    };
  },

  isOnline() {
    return navigator.onLine;
  }
};

export default lessonService;