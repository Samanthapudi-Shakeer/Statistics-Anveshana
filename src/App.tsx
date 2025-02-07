import React, { useState } from 'react';
import yaswanthImg from "./images/yaswanth.jpg";
import shakeerImg from "./images/shakeer.jpg";
import prathyushImg from "./images/prathyush.jpg";
import harshithaImg from "./images/harshitha.jpg";
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { ProbabilityAnalysis } from './components/ProbabilityAnalysis';
import { HypothesisTests } from './components/HypothesisTests';
import { RegressionAnalysis } from './components/RegressionAnalysis';
import { AdvancedAnalysis } from './components/AdvancedAnalysis';
import { Tutorial } from './components/Tutorial';
import { Navigation } from './components/Navigation';
import { WebsiteProvider } from './context/WebsiteContext';
import { AlertCircle, Loader2, Github, Linkedin, Globe, Mail, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [analysisData, setAnalysisData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<string>('');


  const developers = [
      {
          name: "♞ Yaswanth Sai V",
          image :yaswanthImg,
          linkedin: "https://www.linkedin.com/in/yaswanth-sai-43ab47258/",
          github : "https://github.com/yaswanth-142004"
      },
      {
          name: "♞ Shakeer S",
          image: shakeerImg,
          linkedin: "https://www.linkedin.com/in/shakeer-samanthapudi/",
          github : "https://github.com/Samanthapudi-Shakeer/"
      },
      {
          name: "♞ Prathyush G",
          image: prathyushImg,
          linkedin: "https://www.linkedin.com/in/gutha-prathyush-6215ba255/",
          github : "https://github.com/GuthaPrathyush"
      },
      {
          name: "♞ N.S.K.S Harshitha",
          image: harshithaImg,
          linkedin: "https://www.linkedin.com/in/harshitha-nalla-877001259/",
          github : "https://github.com/harshitha-nalla"
      }
  ];


  const handleDataReceived = (data: any, datasetName?: string) => {
    setAnalysisData(data);
    if (datasetName) {
      setCurrentDataset(datasetName);
    }
    setActiveTab('analysis');
  };

  const handleTabChange = (tab: string) => {
    if (tab !== 'home' && tab !== 'tutorial' && !analysisData) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Processing your data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Welcome to StatAnveshak
                </h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                  Your comprehensive platform for statistical analysis and data visualization
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50/80 backdrop-blur-sm p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Getting Started</h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Upload your CSV data file or choose from our sample datasets</li>
                      <li>Explore automated analysis and insights</li>
                      <li>Visualize your data with interactive charts</li>
                      <li>Perform advanced statistical tests</li>
                    </ol>
                  </div>

                  <div className="bg-green-50/80 backdrop-blur-sm p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Features</h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-600">
                      <li>Comprehensive Descriptive Statistics</li>
                      <li>Advanced Probability Analysis</li>
                      <li>Hypothesis Testing Suite</li>
                      <li>Regression Analysis Tools</li>
                      <li>Interactive Data Visualizations</li>
                      <li>Educational Resources & Tutorials</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <FileUpload 
                onDataReceived={handleDataReceived}
                setLoading={setLoading}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Meet the Neural Knights ♞
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {developers.map((dev, index) => (
                  <div key={index} className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md transform hover:scale-105 transition-duration-300">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white shadow-lg"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">{dev.name}</h3>
                    <p className="text-gray-600 mb-4">{dev.role}</p>
                    <div className="flex space-x-4">
                      <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        <Github className="w-5 h-5" />
                      </a><a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
              {currentDataset && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Currently Analyzing: {currentDataset}
                  </h3>
                </div>
              )}
              <AnalysisResults data={analysisData} />
            </div>
          </div>
        );
      case 'probability':
        return <ProbabilityAnalysis data={analysisData} />;
      case 'hypothesis':
        return <HypothesisTests data={analysisData} />;
      case 'regression':
        return <RegressionAnalysis data={analysisData} />;
      case 'advanced':
        return <AdvancedAnalysis data={analysisData} />;
      case 'tutorial':
        return <Tutorial />;
      default:
        return null;
    }
  };

  return (
    <WebsiteProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold">
                  <span className="text-blue-600">Stat</span>
                  <span className="text-purple-600">Anveshak</span>
                  <Search className="inline-block w-6 h-6 ml-2 text-purple-600" />
                </h1>
                <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
              </div>
              {analysisData && (
                <button
                  onClick={() => {
                    setAnalysisData(null);
                    setCurrentDataset('');
                    setActiveTab('home');
                  }}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear Data
                </button>
              )}
            </div>
          </div>
        </nav>

        {showWarning && (
          <div className="fixed top-20 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50 animate-fade-in-down">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>Please upload a CSV file or select a sample dataset to begin analysis.</p>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-8">
          {renderContent()}
        </main>

        <footer className="bg-white/80 backdrop-blur-sm mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-blue-600">Stat</span>
                <span className="text-purple-600">Anveshak</span>
                <span> - </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-blue-500 to-green-500">
                  Neural Knights ♞
                </span>
              </h3>
              <p className="text-gray-600">
                Empowering data analysis through advanced statistical tools
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <a href="mailto:shakeer.samanthapudi@gmail.com" className="text-gray-600 hover:text-blue-600">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WebsiteProvider>
  );
}

export default App;
