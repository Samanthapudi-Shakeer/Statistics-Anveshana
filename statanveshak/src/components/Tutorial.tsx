import React, { useState } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';

const tutorials = [
  {
    id: 'descriptive-stats',
    title: 'Descriptive Statistics',
    content: `Descriptive statistics summarize and describe the main features of a dataset.
    
Key concepts:
1. Measures of Central Tendency (Mean, Median, Mode)
2. Measures of Spread (Variance, Standard Deviation)
3. Distribution Shape (Skewness, Kurtosis)
4. Quartiles and Percentiles
5. Data Visualization Techniques
6. Outlier Detection and Treatment`,
    quiz: [
      {
        question: 'What is the mean of the numbers 2, 4, 6, 8, 10?',
        options: ['4', '5', '6', '8'],
        correctAnswer: 2
      },
      {
        question: 'Which measure is most affected by outliers?',
        options: ['Median', 'Mode', 'Mean', 'IQR'],
        correctAnswer: 2
      },
      {
        question: 'What does a positive skewness indicate?',
        options: [
          'Data is symmetric',
          'Data has a longer tail on the right',
          'Data has a longer tail on the left',
          'Data is normally distributed'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which measure of central tendency should you use for categorical data?',
        options: ['Mean', 'Median', 'Mode', 'Standard Deviation'],
        correctAnswer: 2
      },
      {
        question: 'What is the relationship between variance and standard deviation?',
        options: [
          'They are the same',
          'Standard deviation is the square of variance',
          'Variance is the square of standard deviation',
          'They are inversely proportional'
        ],
        correctAnswer: 2
      },
      {
        question: 'In a normal distribution, what percentage of data falls within one standard deviation of the mean?',
        options: ['50%', '68%', '95%', '99.7%'],
        correctAnswer: 1
      }
    ],
    links: [
      { text: 'Khan Academy - Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
      { text: 'StatQuest Videos', url: 'https://www.youtube.com/c/joshstarmer' },
      { text: 'Descriptive Statistics Guide', url: 'https://www.scribbr.com/statistics/descriptive-statistics/' }
    ],
    alternativeResources: [
      {
        title: 'Khan Academy Statistics Course',
        url: 'https://www.khanacademy.org/math/statistics-probability'
      },
      {
        title: 'StatQuest Basic Statistics Playlist',
        url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9'
      }
    ],
    videoUrl: 'https://www.youtube.com/embed/xxpc-HPKN28'
  },
  {
    id: 'hypothesis-testing',
    title: 'Hypothesis Testing',
    content: `Hypothesis testing is a method for testing a claim about a parameter in a population using data from a sample.

Key concepts:
1. Null and Alternative Hypotheses
2. P-value and Significance Level
3. Type I and Type II Errors
4. Statistical Power
5. Common Tests:
   - T-tests (One-sample, Two-sample, Paired)
   - Z-tests
   - ANOVA
   - Chi-square tests
6. Assumptions and Conditions`,
    quiz: [
      {
        question: 'What is the conventional significance level used in hypothesis testing?',
        options: ['0.01', '0.05', '0.1', '0.5'],
        correctAnswer: 1
      },
      {
        question: 'What happens when we reject a true null hypothesis?',
        options: ['Type I Error', 'Type II Error', 'No Error', 'Statistical Power'],
        correctAnswer: 0
      },
      {
        question: 'Which test should you use to compare means of three or more groups?',
        options: ['T-test', 'Z-test', 'ANOVA', 'Chi-square test'],
        correctAnswer: 2
      },
      {
        question: 'What does a p-value of 0.03 indicate at α = 0.05?',
        options: [
          'Accept the null hypothesis',
          'Reject the null hypothesis',
          'The test is inconclusive',
          'Need more data'
        ],
        correctAnswer: 1
      }
    ],
    links: [
      { text: 'Statistics How To', url: 'https://www.statisticshowto.com/' },
      { text: 'OpenIntro Statistics', url: 'https://www.openintro.org/book/os/' },
      { text: 'Hypothesis Testing Guide', url: 'https://www.scribbr.com/statistics/hypothesis-testing/' }
    ],
    alternativeResources: [
      {
        title: 'Khan Academy Statistics Course',
        url: 'https://www.khanacademy.org/math/statistics-probability'
      },
      {
        title: 'StatQuest Basic Statistics Playlist',
        url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9'
      }
    ],
    videoUrl: 'https://www.youtube.com/embed/0oc49DyA3hU'
  },
  {
    id: 'regression-analysis',
    title: 'Regression Analysis',
    content: `Regression analysis is a statistical method for modeling relationships between variables.

Key concepts:
1. Simple Linear Regression
2. Multiple Linear Regression
3. Model Assumptions
4. R-squared and Adjusted R-squared
5. Residual Analysis
6. Feature Selection and Model Validation
7. Polynomial Regression
8. Logistic Regression for Classification`,
    quiz: [
      {
        question: 'What does R-squared measure?',
        options: [
          'The slope of the regression line',
          'The proportion of variance explained by the model',
          'The correlation between variables',
          'The prediction error'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which assumption is NOT required for linear regression?',
        options: [
          'Linearity',
          'Independence of errors',
          'Normal distribution of predictors',
          'Homoscedasticity'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is multicollinearity?',
        options: [
          'Multiple dependent variables',
          'High correlation between predictors',
          'Non-linear relationships',
          'Heteroscedasticity'
        ],
        correctAnswer: 1
      }
    ],
    links: [
      { text: 'Regression Analysis Tutorial', url: 'https://www.statmethods.net/stats/regression.html' },
      { text: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/linear-regression-tutorial-using-gradient-descent-for-machine-learning/' }
    ],
    alternativeResources: [
      {
        title: 'Khan Academy Statistics Course',
        url: 'https://www.khanacademy.org/math/statistics-probability'
      },
      {
        title: 'StatQuest Basic Statistics Playlist',
        url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9'
      }
    ],
    videoUrl: 'https://www.youtube.com/embed/zPG4NjIkCjc'
  }
];

export const Tutorial: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState(tutorials[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAlternativeResources, setShowAlternativeResources] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = getScore();
    const percentage = (score / selectedTutorial.quiz.length) * 100;
    setShowAlternativeResources(percentage < 50);
  };

  const getScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === selectedTutorial.quiz[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tutorial
          </label>
          <select
            value={selectedTutorial.id}
            onChange={(e) => {
              setSelectedTutorial(tutorials.find(t => t.id === e.target.value) || tutorials[0]);
              setSelectedAnswers([]);
              setShowResults(false);
            }}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {tutorials.map(tutorial => (
              <option key={tutorial.id} value={tutorial.id}>{tutorial.title}</option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-bold mb-4">{selectedTutorial.title}</h2>
        
        {/* Video Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Tutorial Video</h3>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={selectedTutorial.videoUrl}
              title="Tutorial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          {selectedTutorial.content.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
          <ul className="space-y-2">
            {selectedTutorial.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Knowledge Check</h3>
          <div className="space-y-6">
            {selectedTutorial.quiz.map((question, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <p className="font-medium">{qIndex + 1}. {question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, aIndex) => (
                    <label
                      key={aIndex}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                        selectedAnswers[qIndex] === aIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={selectedAnswers[qIndex] === aIndex}
                        onChange={() => handleAnswerSelect(qIndex, aIndex)}
                        className="text-blue-600"
                        disabled={showResults}
                      />
                      <span>{option}</span>
                      {showResults && (
                        <span className="ml-2">
                          {aIndex === question.correctAnswer ? (
                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                          ) : selectedAnswers[qIndex] === aIndex ? (
                            <XCircle className="text-red-500 w-5 h-5" />
                          ) : null}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!showResults ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.length !== selectedTutorial.quiz.length}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">
                Your Score: {getScore()} out of {selectedTutorial.quiz.length} (
                {((getScore() / selectedTutorial.quiz.length) * 100).toFixed(1)}%)
              </p>
              {showAlternativeResources && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    We recommend reviewing the material before proceeding
                  </h4>
                  <p className="text-yellow-700 mb-4">
                    Here are some additional resources to help you understand the concepts better:
                  </p>
                  <ul className="space-y-2">
                    {selectedTutorial.alternativeResources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers([]);
                        setShowAlternativeResources(false);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Review and Try Again
                    </button>
                  </div>
                </div>
              )}
              {!showAlternativeResources && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700">
                    Congratulations! You've passed the quiz. You can proceed to the next section.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};