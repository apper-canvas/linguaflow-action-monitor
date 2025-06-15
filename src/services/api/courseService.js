import coursesData from '../mockData/courses.json';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const courseService = {
  async getAll() {
    await delay(300);
    return [...coursesData];
  },

  async getById(id) {
    await delay(250);
    const course = coursesData.find(course => course.id === id);
    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      completedLessons: 0
    };
    coursesData.push(newCourse);
    toast.success('Course created successfully!');
    return { ...newCourse };
  },

  async update(id, updates) {
    await delay(350);
    const courseIndex = coursesData.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    coursesData[courseIndex] = { ...coursesData[courseIndex], ...updates };
    toast.success('Course updated successfully!');
    return { ...coursesData[courseIndex] };
  },

  async delete(id) {
    await delay(300);
    const courseIndex = coursesData.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    coursesData.splice(courseIndex, 1);
    toast.success('Course deleted successfully!');
    return true;
  }
};

export default courseService;