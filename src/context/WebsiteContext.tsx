import React, { createContext, useContext, useState } from 'react';

interface Tutorial {
  id: string;
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface WebsiteContextType {
  currentTutorial: Tutorial | null;
  setCurrentTutorial: (tutorial: Tutorial | null) => void;
  quizAnswers: Record<string, number[]>;
  setQuizAnswers: (answers: Record<string, number[]>) => void;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number[]>>({});

  return (
    <WebsiteContext.Provider
      value={{
        currentTutorial,
        setCurrentTutorial,
        quizAnswers,
        setQuizAnswers,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};