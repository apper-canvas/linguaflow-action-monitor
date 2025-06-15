import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FlashcardComponent = ({ flashcard, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = () => {
    // Simulate audio playback
    setHasPlayed(true);
    setTimeout(() => setHasPlayed(false), 1000);
  };

  const handleRate = (difficulty) => {
    onRate(flashcard.id, difficulty);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flip-card h-80 mb-6" onClick={handleFlip}>
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front of card */}
          <div className="flip-card-front bg-gradient-to-br from-primary to-secondary p-8 flex flex-col items-center justify-center text-white shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">
                {flashcard.front}
              </h2>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
                <span className="text-sm">Tap to reveal</span>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="flip-card-back bg-gradient-to-br from-success to-info p-8 flex flex-col items-center justify-center text-white shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold mb-2">
                {flashcard.back}
              </h2>
              <p className="text-sm text-white/80 mb-4">
                Category: {flashcard.category}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                className={`p-3 rounded-full ${
                  hasPlayed ? 'bg-white/30' : 'bg-white/20'
                } hover:bg-white/30 transition-colors`}
              >
                <ApperIcon 
                  name={hasPlayed ? "Volume2" : "Volume1"} 
                  className="w-6 h-6" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons (only show when flipped) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-3"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(1)}
            className="text-error hover:bg-error/10"
          >
            <ApperIcon name="ThumbsDown" className="w-4 h-4 mr-2" />
            Hard
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(3)}
            className="text-warning hover:bg-warning/10"
          >
            <ApperIcon name="Minus" className="w-4 h-4 mr-2" />
            Good
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(5)}
            className="text-success hover:bg-success/10"
          >
            <ApperIcon name="ThumbsUp" className="w-4 h-4 mr-2" />
            Easy
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardComponent;