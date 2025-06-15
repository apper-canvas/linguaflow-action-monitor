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
  }
};

export default lessonService;