import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const VideoPlayer = ({ lesson, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Auto-complete lesson when video ends
      if (videoRef.current.currentTime >= videoRef.current.duration * 0.9) {
        onComplete?.();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        {/* Placeholder for actual video */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center">
          <div className="text-center text-white">
            <ApperIcon name="Play" className="w-16 h-16 mx-auto mb-4 opacity-60" />
            <h3 className="text-xl font-heading font-semibold mb-2">
              {lesson.title}
            </h3>
            <p className="text-surface-300">
              Duration: {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
            </p>
          </div>
        </div>

        {/* Simulated video element for time tracking */}
        <video
          ref={videoRef}
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={lesson.videoUrl} type="video/mp4" />
        </video>

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} className="w-5 h-5" />
            </Button>

            <div className="flex-1">
              <div className="bg-white/30 rounded-full h-1 mb-2">
                <motion.div
                  className="bg-white rounded-full h-1"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || lesson.duration)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="FileText" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      {showTranscript && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-6 border-t border-surface-200"
        >
          <h4 className="font-heading font-semibold text-surface-900 mb-3">
            Transcript
          </h4>
          <p className="text-surface-700 leading-relaxed">
            {lesson.transcript}
          </p>
        </motion.div>
      )}

      {/* Lesson Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-surface-900">
              {lesson.title}
            </h2>
            <p className="text-surface-600">
              Lesson {lesson.order} • {Math.floor(lesson.duration / 60)} minutes
            </p>
          </div>
          
          {lesson.completed && (
            <div className="flex items-center space-x-2 text-success">
              <ApperIcon name="CheckCircle" className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Vocabulary Preview */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <div>
            <h4 className="font-heading font-semibold text-surface-900 mb-3">
              Key Vocabulary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.vocabulary.slice(0, 4).map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-50 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-surface-900">
                        {word.word}
                      </span>
                      <p className="text-sm text-surface-600">
                        {word.translation}
                      </p>
                    </div>
                    <span className="text-xs text-surface-500 italic">
                      {word.pronunciation}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;