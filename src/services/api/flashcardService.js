import flashcardsData from '../mockData/flashcards.json';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const flashcardService = {
  async getAll() {
    await delay(300);
    return [...flashcardsData];
  },

  async getById(id) {
    await delay(250);
    const flashcard = flashcardsData.find(card => card.id === id);
    if (!flashcard) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    return { ...flashcard };
  },

  async getByCourseId(courseId) {
    await delay(300);
    return flashcardsData.filter(card => card.courseId === courseId);
  },

  async create(flashcardData) {
    await delay(400);
    const newFlashcard = {
      ...flashcardData,
      id: `flashcard-${Date.now()}`,
      difficulty: 1,
      lastReviewed: null
    };
    flashcardsData.push(newFlashcard);
    toast.success('Flashcard created successfully!');
    return { ...newFlashcard };
  },

  async update(id, updates) {
    await delay(350);
    const cardIndex = flashcardsData.findIndex(card => card.id === id);
    if (cardIndex === -1) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    flashcardsData[cardIndex] = { ...flashcardsData[cardIndex], ...updates };
    return { ...flashcardsData[cardIndex] };
  },

  async updateDifficulty(id, difficulty) {
    await delay(250);
    const updates = { 
      difficulty, 
      lastReviewed: new Date().toISOString() 
    };
    return this.update(id, updates);
  },

  async delete(id) {
    await delay(300);
    const cardIndex = flashcardsData.findIndex(card => card.id === id);
    if (cardIndex === -1) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    flashcardsData.splice(cardIndex, 1);
    toast.success('Flashcard deleted successfully!');
    return true;
  }
};

export default flashcardService;