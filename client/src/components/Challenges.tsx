import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallenge } from "@/context/ChallengeContext";
import { Challenge } from "@shared/schema";

const Challenges = () => {
  const { currentChallenge, setCurrentChallenge, selectedOption, answerResult, selectOption, checkAnswer, showHint, hintVisible } = useChallenge();
  
  // Load challenges data
  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    staleTime: 60000, // 1 minute
  });

  // Select a challenge by type
  const selectChallenge = (type: string) => {
    if (!challenges) return;
    
    const filteredChallenges = challenges.filter(
      challenge => challenge.type.toLowerCase() === type.toLowerCase()
    );
    
    if (filteredChallenges.length > 0) {
      setCurrentChallenge(filteredChallenges[0]);
    }
  };

  // Ensure we have a current challenge when data loads
  useEffect(() => {
    if (challenges && challenges.length > 0 && !currentChallenge) {
      setCurrentChallenge(challenges[0]);
    }
  }, [challenges, currentChallenge, setCurrentChallenge]);

  // Parse questions from JSON for the current challenge
  const getCurrentQuestions = () => {
    if (!currentChallenge) return null;
    
    try {
      return typeof currentChallenge.questions === 'string' 
        ? JSON.parse(currentChallenge.questions) 
        : currentChallenge.questions;
    } catch (error) {
      console.error("Error parsing questions:", error);
      return null;
    }
  };

  const questions = getCurrentQuestions();
  const currentQuestion = questions && questions.length > 0 ? questions[0] : null;
  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOption === optionId;
    const isCorrectOption = answerResult?.correctAnswer === optionId;

    if (answerResult) {
      if (isCorrectOption) {
        return "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200";
      }
      if (isSelected && !answerResult.isCorrect) {
        return "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-200";
      }
      return "border-slate-200 bg-white text-slate-700 opacity-80";
    }

    if (isSelected) {
      return "border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-200";
    }

    return "border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:bg-emerald-50";
  };

  const getOptionBadgeStyle = (optionId: string) => {
    const isSelected = selectedOption === optionId;
    const isCorrectOption = answerResult?.correctAnswer === optionId;

    if (answerResult) {
      if (isCorrectOption) return "border-emerald-600 bg-emerald-600 text-white";
      if (isSelected && !answerResult.isCorrect) return "border-red-600 bg-red-600 text-white";
    }

    return isSelected
      ? "border-emerald-600 bg-emerald-600 text-white"
      : "border-slate-300 bg-white text-slate-700";
  };

  return (
    <section id="challenges" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3 text-emerald-900">Cultural Challenges</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Test your knowledge about wildlife and learn about different cultures through fun interactive challenges</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Current Challenge Card */}
          {isLoading ? (
            <Card className="mb-10">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-primary p-6">
                  <Skeleton className="h-6 w-36 bg-white bg-opacity-20 mb-4" />
                  <Skeleton className="h-4 w-full bg-white bg-opacity-20 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-20 bg-white bg-opacity-20 mr-3" />
                    <Skeleton className="h-4 w-20 bg-white bg-opacity-20" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-3 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </div>
            </Card>
          ) : currentChallenge && currentQuestion ? (
            <Card className="mb-10 overflow-hidden bg-white text-slate-950 border-slate-200 shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-emerald-900 p-6 text-white">
                  <h3 className="font-heading font-bold text-xl mb-4">{currentChallenge.title}</h3>
                  <p className="mb-4 text-white text-opacity-90">{currentChallenge.description}</p>
                  <div className="flex items-center">
                    <span className="mr-3"><i className="fas fa-clock mr-1"></i> 5 mins</span>
                    <span><i className="fas fa-medal mr-1"></i> 100 pts</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6 bg-white">
                  <h4 className="font-heading font-bold text-lg mb-4">{currentQuestion.question}</h4>
                  
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options && currentQuestion.options.map((option: any) => (
                      <div 
                        key={option.id}
                        className={`game-option flex items-center p-3 border rounded-lg cursor-pointer transition-all ${getOptionStyle(option.id)}`}
                        onClick={() => selectOption(option.id)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-3 font-semibold ${getOptionBadgeStyle(option.id)}`}>
                          <span>{option.id.toUpperCase()}</span>
                        </div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {answerResult && (
                    <div
                      className={`mb-4 rounded-lg border p-4 ${
                        answerResult.isCorrect
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                          : "border-red-300 bg-red-50 text-red-950"
                      }`}
                    >
                      <p className="font-bold">
                        {answerResult.isCorrect ? "Correct" : "Incorrect"}
                      </p>
                      <p className="mt-1 text-sm">
                        {answerResult.isCorrect
                          ? "Great job. You earned 100 points."
                          : `The correct answer is ${answerResult.correctAnswer.toUpperCase()}.`}
                      </p>
                    </div>
                  )}

                  {hintVisible && currentQuestion.explanation && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <i className="fas fa-lightbulb mr-1"></i> 
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      className="text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 flex items-center"
                      onClick={showHint}
                    >
                      <i className="fas fa-lightbulb mr-1"></i> Hint
                    </Button>
                    <Button 
                      className="bg-emerald-700 hover:bg-emerald-800 text-white disabled:bg-slate-300 disabled:text-slate-500"
                      onClick={checkAnswer}
                      disabled={!selectedOption || !!answerResult}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="text-center p-8 bg-yellow-50 rounded-lg mb-10">
              <p className="text-yellow-700">No challenges found. Please try again later.</p>
            </div>
          )}
          
          {/* Challenge Selection */}
          <h3 className="font-heading font-bold text-2xl mb-6 text-center text-slate-950">More Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-36 w-full" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              challenges?.filter(challenge => 
                !currentChallenge || challenge.id !== currentChallenge.id
              ).map((challenge) => (
                <div 
                  key={challenge.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setCurrentChallenge(challenge)}
                >
                  <div 
                    className="h-36 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${challenge.imageUrl}')` }}
                  ></div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h4>
                      <span className={`${
                        challenge.difficulty.toLowerCase() === 'easy' 
                          ? 'bg-green-500' 
                          : challenge.difficulty.toLowerCase() === 'medium'
                          ? 'bg-secondary'
                          : 'bg-accent'
                      } text-white text-xs py-1 px-2 rounded-lg`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{challenge.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
