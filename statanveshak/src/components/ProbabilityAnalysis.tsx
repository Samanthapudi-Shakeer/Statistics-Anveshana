import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as ss from 'simple-statistics';
import { AlertCircle } from 'lucide-react';

interface ProbabilityAnalysisProps {
  data: any;
}

export const ProbabilityAnalysis: React.FC<ProbabilityAnalysisProps> = ({ data }) => {
  const [selectedDistribution, setSelectedDistribution] = useState<string>('normal');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const distributions = [
    { id: 'normal', name: 'Normal Distribution' },
    { id: 'binomial', name: 'Binomial Distribution' },
    { id: 'poisson', name: 'Poisson Distribution' },
    { id: 'uniform', name: 'Uniform Distribution' },
    { id: 'exponential', name: 'Exponential Distribution' }
  ];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const generateDistributionPlot = () => {
    if (!data || !selectedColumn) return null;

    const values = data.descriptive[selectedColumn];
    const mean = values.mean;
    const std = values.std;
    const min = values.min;
    const max = values.max;

    let plotData: any[] = [];

    // Actual data histogram
    const histogramData = {
      x: data[selectedColumn],
      type: 'histogram',
      name: 'Actual Data',
      opacity: 0.7,
      nbinsx: 30
    };

    // Theoretical distribution
    const theoreticalData = {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'lines',
      name: 'Theoretical Distribution',
      line: { color: 'red' }
    };

    switch (selectedDistribution) {
      case 'normal':
        const x = Array.from({ length: 100 }, (_, i) => mean - 4 * std + (i * 8 * std) / 99);
        theoreticalData.x = x;
        theoreticalData.y = x.map(val => 
          (1 / (std * Math.sqrt(2 * Math.PI))) * 
          Math.exp(-0.5 * Math.pow((val - mean) / std, 2))
        );
        break;

      case 'uniform':
        theoreticalData.x = [min, min, max, max];
        theoreticalData.y = [0, 1 / (max - min), 1 / (max - min), 0];
        break;

      case 'exponential':
        const lambda = 1 / mean;
        const expX = Array.from({ length: 100 }, (_, i) => i * (max / 99));
        theoreticalData.x = expX;
        theoreticalData.y = expX.map(x => lambda * Math.exp(-lambda * x));
        break;

      case 'poisson':
        const poissonX = Array.from({ length: Math.ceil(max) + 1 }, (_, i) => i);
        theoreticalData.x = poissonX;
        theoreticalData.y = poissonX.map(k => 
          (Math.pow(mean, k) * Math.exp(-mean)) / ss.factorial(k)
        );
        break;

      case 'binomial':
        const n = Math.round(max);
        const p = mean / n;
        const binomialX = Array.from({ length: n + 1 }, (_, i) => i);
        theoreticalData.x = binomialX;
        theoreticalData.y = binomialX.map(k => 
          ss.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
        );
        break;
    }

    return (
      <Plot
        data={[histogramData, theoreticalData]}
        layout={{
          width: 800,
          height: 400,
          title: `${selectedDistribution.charAt(0).toUpperCase() + selectedDistribution.slice(1)} Distribution Fit`,
          xaxis: { title: 'Value' },
          yaxis: { title: 'Frequency/Density' },
          showlegend: true,
          bargap: 0.05
        }}
      />
    );
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{notification}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Probability Analysis</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Column
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a column...</option>
              {data?.numericalColumns?.map((col: string) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Distribution
            </label>
            <select
              value={selectedDistribution}
              onChange={(e) => setSelectedDistribution(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {distributions.map(dist => (
                <option key={dist.id} value={dist.id}>{dist.name}</option>
              ))}
            </select>
          </div>
        </div>

        {generateDistributionPlot()}
        
        {selectedColumn && (
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Distribution Statistics</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="space-y-2">
                  <li>Mean (μ): {data?.descriptive[selectedColumn]?.mean.toFixed(4)}</li>
                  <li>Standard Deviation (σ): {data?.descriptive[selectedColumn]?.std.toFixed(4)}</li>
                  <li>Variance (σ²): {data?.descriptive[selectedColumn]?.variance.toFixed(4)}</li>
                  <li>Skewness: {data?.distributions[selectedColumn]?.skewness.toFixed(4)}</li>
                  <li>Kurtosis: {data?.distributions[selectedColumn]?.kurtosis.toFixed(4)}</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Distribution Information</h3>
              <div className="bg-gray-50 p-4 rounded-md prose prose-sm max-w-none">
                {data?.distributions[selectedColumn]?.bestFit && (
                  <>
                    <h4>Best Fitting Distribution: {data.distributions[selectedColumn].bestFit.type}</h4>
                    <p className="whitespace-pre-line">{data.distributions[selectedColumn].bestFit.description}</p>
                    <div className="mt-4 aspect-video">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={data.distributions[selectedColumn].bestFit.videoUrl}
                        title="Distribution Educational Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProbabilityAnalysis;