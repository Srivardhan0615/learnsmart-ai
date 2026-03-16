import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI, examAPI, topicsAPI } from '@/services/api';
import AuroraBackground from '@/components/AuroraBackground';
import GlassCard from '@/components/GlassCard';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_QUESTIONS = 10;
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const Exam = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopicAndQuestion();
  }, [topicId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const fetchTopicAndQuestion = async () => {
    try {
      const topicRes = await topicsAPI.getById(topicId);
      setTopic(topicRes.data);
      await fetchNextQuestion('easy');
    } catch (error) {
      console.error('Failed to load exam', error);
      toast.error('Failed to load exam');
      navigate('/topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async (difficulty) => {
    try {
      const response = await questionsAPI.getAdaptive(topicId, difficulty);
      setCurrentQuestion(response.data);
      setSelectedOption(null);
    } catch (error) {
      console.error('Failed to fetch question', error);
      toast.error('Failed to load question');
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      toast.error('Please select an answer');
      return;
    }

    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    // Save answer
    setAnswers(prev => [
      ...prev,
      {
        question_id: currentQuestion.id,
        selected_answer: selectedOption,
        time_taken: timeTaken
      }
    ]);

    // Check if exam is complete
    if (questionNumber >= TOTAL_QUESTIONS) {
      await submitExam([...answers, {
        question_id: currentQuestion.id,
        selected_answer: selectedOption,
        time_taken: timeTaken
      }]);
      return;
    }

    // Adaptive difficulty adjustment
    let nextDifficulty = currentDifficulty;
    if (isCorrect) {
      // Increase difficulty
      if (currentDifficulty === 'easy') nextDifficulty = 'medium';
      else if (currentDifficulty === 'medium') nextDifficulty = 'hard';
    } else {
      // Decrease difficulty
      if (currentDifficulty === 'hard') nextDifficulty = 'medium';
      else if (currentDifficulty === 'medium') nextDifficulty = 'easy';
    }

    setCurrentDifficulty(nextDifficulty);
    setQuestionNumber(prev => prev + 1);
    setStartTime(Date.now());
    await fetchNextQuestion(nextDifficulty);
  };

  const submitExam = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const response = await examAPI.submit({
        topic_id: topicId,
        answers: finalAnswers
      });
      toast.success('Exam submitted successfully!');
      navigate(`/results/${response.data.attempt_id}`);
    } catch (error) {
      console.error('Failed to submit exam', error);
      toast.error('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Loading exam...</div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AuroraBackground />
        <div className="text-xl text-slate-300">Submitting exam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold gradient-text" data-testid="exam-title">{topic?.title} - Adaptive Test</h1>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800">
                <Clock className="w-5 h-5 text-violet-400" />
                <span className="font-mono" data-testid="timer">{formatTime(elapsedTime)}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-300"
                style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }}
                data-testid="progress-bar"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-400">
              <span data-testid="question-progress">Question {questionNumber} of {TOTAL_QUESTIONS}</span>
              <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(currentDifficulty)} font-medium`} data-testid="difficulty-badge">
                {currentDifficulty.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <GlassCard className="p-8" data-testid="question-card">
              {currentQuestion ? (
                <>
                  <h2 className="text-2xl font-semibold mb-8" data-testid="question-text">
                    {currentQuestion.question}
                  </h2>

                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          selectedOption === index
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-800 bg-slate-900/30 hover:border-violet-500/50'
                        }`}
                        data-testid={`option-${index}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === index
                              ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-600'
                          }`}>
                            {selectedOption === index && (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className={`w-full mt-8 btn-primary ${
                      selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    data-testid="next-question-btn"
                  >
                    {questionNumber >= TOTAL_QUESTIONS ? 'Submit Exam' : 'Next Question'}
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-xl text-slate-300">Loading question...</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
