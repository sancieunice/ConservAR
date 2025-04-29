import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallenge } from "@/context/ChallengeContext";
import { Challenge } from "@shared/schema";

const Challenges = () => {
  const { currentChallenge, setCurrentChallenge, selectedOption, selectOption, checkAnswer, showHint, hintVisible } = useChallenge();
  
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

  return (
    <section id="challenges" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3 text-primary">Cultural Challenges</h2>
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
            <Card className="mb-10">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-primary p-6 text-white">
                  <h3 className="font-heading font-bold text-xl mb-4">{currentChallenge.title}</h3>
                  <p className="mb-4 text-white text-opacity-90">{currentChallenge.description}</p>
                  <div className="flex items-center">
                    <span className="mr-3"><i className="fas fa-clock mr-1"></i> 5 mins</span>
                    <span><i className="fas fa-medal mr-1"></i> 100 pts</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h4 className="font-heading font-bold text-lg mb-4">{currentQuestion.question}</h4>
                  
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options && currentQuestion.options.map((option: any) => (
                      <div 
                        key={option.id}
                        className={`game-option flex items-center p-3 border ${
                          selectedOption === option.id 
                            ? 'border-primary bg-primary bg-opacity-10' 
                            : 'border-gray-200'
                        } rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50`}
                        onClick={() => selectOption(option.id)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          selectedOption === option.id 
                            ? 'border-primary text-primary' 
                            : 'border-gray-300'
                        } mr-3`}>
                          <span>{option.id.toUpperCase()}</span>
                        </div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                  
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
                      className="text-primary hover:text-secondary flex items-center"
                      onClick={showHint}
                    >
                      <i className="fas fa-lightbulb mr-1"></i> Hint
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-secondary text-white"
                      onClick={checkAnswer}
                      disabled={!selectedOption}
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
          <h3 className="font-heading font-bold text-2xl mb-6 text-center">More Challenges</h3>
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
