import React, { useState } from 'react';
import { Upload, Database, ChevronRight, Info, Search } from 'lucide-react';
import { analyzeFile } from '../services/api';

interface FileUploadProps {
  onDataReceived: (data: any, datasetName?: string) => void;
  setLoading: (loading: boolean) => void;
}

const sampleDatasets = [
  {
    name: 'Melbourne Housing',
    description: 'House prices in Melbourne with various features',
    url: 'https://raw.githubusercontent.com/jbrownlee/Datasets/master/housing.csv',
    features: ['Price', 'Rooms', 'Distance', 'Postcode', 'Bedroom2', 'Bathroom', 'Car', 'Landsize', 'BuildingArea'],
    recommendedAnalysis: ['Regression', 'Price Prediction', 'Feature Importance']
  },
  {
    name: 'Iris Dataset',
    description: 'Classic iris flower dataset with measurements',
    url: 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv',
    features: ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'],
    recommendedAnalysis: ['Classification', 'Cluster Analysis', 'Feature Distribution']
  },
  {
    name: 'Diabetes Dataset',
    description: 'Diabetes progression based on patient measurements',
    url: 'https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv',
    features: ['Age', 'Sex', 'BMI', 'Blood Pressure', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Y'],
    recommendedAnalysis: ['Disease Prediction', 'Risk Factor Analysis', 'Feature Correlation']
  },
  {
    name: 'Breast Cancer',
    description: 'Breast cancer diagnostic data from Wisconsin',
    url: 'https://raw.githubusercontent.com/plotly/datasets/master/breast-cancer.csv',
    features: ['ID', 'Diagnosis', 'Radius', 'Texture', 'Perimeter', 'Area', 'Smoothness', 'Compactness', 'Concavity', 'Symmetry', 'Fractal Dimension'],
    recommendedAnalysis: ['Diagnostic Prediction', 'Feature Importance', 'Pattern Recognition']
  }
];

const FileUpload: React.FC<FileUploadProps> = ({ onDataReceived, setLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSampleDatasets, setShowSampleDatasets] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    await processFile(file);
  };

  const handleSampleDataset = async (url: string, index: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSelectedDataset(index);
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'sample-dataset.csv', { type: 'text/csv' });
      await processFile(file, sampleDatasets[index].name);
      setShowSampleDatasets(false);
    } catch (err) {
      setError('Error loading sample dataset');
      console.error(err);
    }
  };

  const processFile = async (file: File, datasetName?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await analyzeFile(file);
      onDataReceived(data, datasetName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">


      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 cursor-pointer shadow-md"
          >
            <Upload size={20} />
            <span className="font-semibold">Upload Your CSV</span>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowSampleDatasets(!showSampleDatasets)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-md"
          >
            <Database size={20} />
            <span className="font-semibold">Sample Datasets</span>
          </button>
        </div>

        {showSampleDatasets && (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Sample Datasets</h3>
            <div className="grid grid-cols-1 gap-6">
              {sampleDatasets.map((dataset, index) => (
                <div
                  key={dataset.name}
                  className={`bg-gradient-to-r ${
                    selectedDataset === index
                      ? 'from-blue-50 to-indigo-50 border-blue-200'
                      : 'from-gray-50 to-gray-50 hover:from-blue-50 hover:to-indigo-50'
                  } border rounded-lg transition-all duration-300`}
                >
                  <button
                    onClick={() => handleSampleDataset(dataset.url, index)}
                    className="w-full text-left p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Database className="w-6 h-6 text-blue-600" />
                          <h4 className="text-xl font-semibold text-gray-900">{dataset.name}</h4>
                        </div>
                        <p className="mt-2 text-gray-600">{dataset.description}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Info className="w-4 h-4 mr-1" />
                              Key Features
                            </h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {dataset.features.slice(0, 4).map((feature, i) => (
                                <li key={i} className="flex items-center">
                                  <ChevronRight className="w-3 h-3 mr-1" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Info className="w-4 h-4 mr-1" />
                              Recommended Analysis
                            </h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {dataset.recommendedAnalysis.map((analysis, i) => (
                                <li key={i} className="flex items-center">
                                  <ChevronRight className="w-3 h-3 mr-1" />
                                  {analysis}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-fade-in">
          <p>Dataset loaded successfully! Starting analysis...</p>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg animate-fade-in">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

export { FileUpload };
