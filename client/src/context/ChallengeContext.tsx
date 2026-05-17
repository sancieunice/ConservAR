import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Challenge } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ChallengeContextType {
  currentChallenge: Challenge | null;
  selectedOption: string | null;
  answerResult: {
    isCorrect: boolean;
    correctAnswer: string;
  } | null;
  score: number;
  hintVisible: boolean;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  selectOption: (optionId: string) => void;
  checkAnswer: () => void;
  showHint: () => void;
  resetChallenge: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const { toast } = useToast();

  const updateCurrentChallenge = (challenge: Challenge | null) => {
    setCurrentChallenge(challenge);
    setSelectedOption(null);
    setAnswerResult(null);
    setHintVisible(false);
  };

  const selectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setAnswerResult(null);
  };

  const checkAnswer = () => {
    if (!currentChallenge || !selectedOption) return;
    
    try {
      // Parse the questions JSON
      const questions = typeof currentChallenge.questions === 'string' 
        ? JSON.parse(currentChallenge.questions) 
        : currentChallenge.questions;
      
      if (!questions || !questions.length || !questions[0].correctAnswer) {
        toast({
          title: "Challenge Error",
          description: "Could not validate your answer due to a challenge data error.",
          variant: "destructive"
        });
        return;
      }
      
      const correctAnswer = questions[0].correctAnswer;
      const isCorrect = selectedOption === correctAnswer;
      setAnswerResult({ isCorrect, correctAnswer });
      
      if (isCorrect) {
        // Correct answer
        setScore(prev => prev + 100);
      }

      setHintVisible(false);
      
    } catch (error) {
      console.error("Error checking answer:", error);
      toast({
        title: "Challenge Error",
        description: "An error occurred while checking your answer.",
        variant: "destructive"
      });
    }
  };

  const showHint = () => {
    setHintVisible(true);
  };

  const resetChallenge = () => {
    setSelectedOption(null);
    setAnswerResult(null);
    setHintVisible(false);
  };

  const value = {
    currentChallenge,
    selectedOption,
    answerResult,
    score,
    hintVisible,
    setCurrentChallenge: updateCurrentChallenge,
    selectOption,
    checkAnswer,
    showHint,
    resetChallenge
  };

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = (): ChallengeContextType => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
