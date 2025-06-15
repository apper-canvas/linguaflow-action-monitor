import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import speakingPracticeService from "@/services/api/speakingPracticeService";
import userProgressService from "@/services/userProgressService";
import Button from "@/components/atoms/Button";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ErrorState from "@/components/molecules/ErrorState";
import ApperIcon from "@/components/ApperIcon";

const SpeakingPractice = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    loadExercises();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await speakingPracticeService.getExercises();
      setExercises(result);
      if (result.length > 0) {
        setCurrentExercise(result[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercises');
      toast.error('Failed to load speaking exercises');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started! Speak clearly into your microphone');
    } catch (err) {
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast.info('Recording stopped. Processing audio...');
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob || !currentExercise) return;
    
    setAnalyzing(true);
    try {
      const analysis = await speakingPracticeService.analyzeAudio(audioBlob, currentExercise.id);
      setResults(analysis);
      setShowResults(true);
      
      // Update user progress
      await userProgressService.updateSpeakingProgress(analysis.overallScore, currentExercise.type);
      
      toast.success(`Analysis complete! Score: ${analysis.overallScore}%`);
    } catch (err) {
      toast.error('Failed to analyze recording');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectNextExercise = () => {
    if (!exercises.length) return;
    
    const currentIndex = exercises.findIndex(ex => ex.id === currentExercise?.id);
    const nextIndex = (currentIndex + 1) % exercises.length;
    setCurrentExercise(exercises[nextIndex]);
    resetSession();
  };

  const resetSession = () => {
    setAudioBlob(null);
    setResults(null);
    setShowResults(false);
    setRecordingTime(0);
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    if (score >= 70) return 'text-accent';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-success/10 border-success/20';
    if (score >= 80) return 'bg-warning/10 border-warning/20';
    if (score >= 70) return 'bg-accent/10 border-accent/20';
    return 'bg-error/10 border-error/20';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" text="Loading speaking exercises..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadExercises} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="mb-8">
        <h1
            className="text-3xl sm:text-4xl font-heading font-bold text-surface-900 mb-2">Speaking Practice 🎤
                    </h1>
        <p className="text-lg text-surface-600">Record yourself speaking and get pronunciation feedback
                    </p>
    </motion.div>
    <AnimatePresence mode="wait">
        {!showResults ? <motion.div
            key="practice"
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -20
            }}
            className="space-y-8">
            {/* Exercise Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading font-bold text-surface-900">Choose Exercise
                                        </h2>
                    <div className="flex items-center space-x-2 text-sm text-surface-600">
                        <ApperIcon name="BookOpen" className="w-4 h-4" />
                        <span>{exercises.length}available</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exercises.map(exercise => <motion.div
                        key={exercise.id}
                        whileHover={{
                            y: -2
                        }}
                        onClick={() => {
                            setCurrentExercise(exercise);
                            resetSession();
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${currentExercise?.id === exercise.id ? "border-primary bg-primary/5" : "border-surface-200 hover:border-primary/30"}`}>
                        <div className="flex items-center space-x-3 mb-2">
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${exercise.difficulty === "beginner" ? "bg-success/10" : exercise.difficulty === "intermediate" ? "bg-warning/10" : "bg-error/10"}`}>
                                <ApperIcon
                                    name={exercise.difficulty === "beginner" ? "CheckCircle" : exercise.difficulty === "intermediate" ? "Clock" : "Zap"}
                                    className={`w-4 h-4 ${exercise.difficulty === "beginner" ? "text-success" : exercise.difficulty === "intermediate" ? "text-warning" : "text-error"}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-surface-900 text-sm">
                                    {exercise.title}
                                </h3>
                                <p className="text-xs text-surface-500 capitalize">
                                    {exercise.difficulty}
                                </p>
                            </div>
                        </div>
                    </motion.div>)}
                </div>
            </div>
            {/* Current Exercise */}
            {currentExercise && <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-surface-900 mb-2">
                            {currentExercise.title}
                        </h2>
                        <p className="text-surface-600 mb-4">
                            {currentExercise.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-surface-500">
                            <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                <span>{currentExercise.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ApperIcon name="Target" className="w-4 h-4" />
                                <span className="capitalize">{currentExercise.difficulty}</span>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
onClick={() => {
                            if (typeof window !== 'undefined' && window.speechSynthesis) {
                                const utterance = new SpeechSynthesisUtterance(currentExercise.text);
                                utterance.rate = 0.8;
                                window.speechSynthesis.speak(utterance);
                            } else {
                                toast.error('Speech synthesis not supported in this browser');
                            }
                        }}
                        className="p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 text-secondary">
                        <ApperIcon name="Volume2" className="w-5 h-5" />
                    </motion.button>
                </div>
                {/* Text to Read */}
                <div className="bg-surface-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-surface-900 mb-3">Read aloud:</h3>
                    <p className="text-lg text-surface-800 leading-relaxed font-medium">"{currentExercise.text}"
                                          </p>
                </div>
                {/* Recording Controls */}
                <div className="flex flex-col items-center space-y-6">
                    {/* Recording Button */}
                    <motion.div
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        className="relative">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            variant={isRecording ? "error" : "primary"}
                            size="lg"
                            icon={isRecording ? "Square" : "Mic"}
                            className="w-48 h-16 text-lg font-semibold"
                            disabled={analyzing}>
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                        {isRecording && <motion.div
                            animate={{
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </motion.div>}
                    </motion.div>
                    {/* Recording Timer */}
                    {isRecording && <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="text-2xl font-bold text-error">
                        {formatTime(recordingTime)}
                    </motion.div>}
                    {/* Analyze Button */}
                    {audioBlob && !isRecording && <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}>
                        <Button
                            onClick={analyzeRecording}
                            variant="success"
                            size="lg"
                            icon="Brain"
                            loading={analyzing}
                            className="w-48">
                            {analyzing ? "Analyzing..." : "Analyze Recording"}
                        </Button>
                    </motion.div>}
                </div>
            </div>}
        </motion.div> : <motion.div
            key="results"
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -20
            }}
            className="space-y-8">
            {/* Results Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-bold text-surface-900 mb-2">Pronunciation Analysis
                                        </h2>
                    <p className="text-surface-600">Here's how you performed compared to native speakers
                                        </p>
                </div>
                {/* Overall Score */}
                <div className="flex justify-center mb-8">
                    <div
                        className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${getScoreBackground(results?.overallScore || 0)}`}>
                        <div className="text-center">
                            <div
                                className={`text-3xl font-bold ${getScoreColor(results?.overallScore || 0)}`}>
                                {results?.overallScore || 0}%
                                                    </div>
                            <div className="text-sm text-surface-600">Overall</div>
                        </div>
                    </div>
                </div>
                {/* Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {results?.detailedScores?.map((score, index) => <div key={index} className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${getScoreColor(score.value)}`}>
                            {score.value}%
                                                </div>
                        <div className="text-sm text-surface-600 mb-2">{score.category}</div>
                        <div className="w-full bg-surface-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${score.value >= 90 ? "bg-success" : score.value >= 80 ? "bg-warning" : score.value >= 70 ? "bg-accent" : "bg-error"}`}
                                style={{
                                    width: `${score.value}%`
                                }} />
                        </div>
                    </div>)}
                </div>
                {/* Feedback */}
                {results?.feedback && <div className="bg-surface-50 rounded-lg p-6 mb-6">
                    <h3
                        className="font-semibold text-surface-900 mb-3 flex items-center space-x-2">
                        <ApperIcon name="MessageCircle" className="w-5 h-5" />
                        <span>Feedback</span>
                    </h3>
                    <p className="text-surface-700 leading-relaxed">
                        {results.feedback}
                    </p>
                </div>}
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={resetSession} variant="primary" icon="RotateCcw">Try Again
                                        </Button>
                    <Button onClick={selectNextExercise} variant="secondary" icon="ArrowRight">Next Exercise
                                        </Button>
                </div>
            </div>
        </motion.div>}
    </AnimatePresence>
</div>
  );
};

export default SpeakingPractice;