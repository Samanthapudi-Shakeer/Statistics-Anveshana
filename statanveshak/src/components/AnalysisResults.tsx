import React from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterPlot } from 'recharts';
import Plot from 'react-plotly.js';
import { AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  data: {
    descriptive: {
      [key: string]: {
        mean: number;
        median: number;
        mode: number;  // Changed from number[] to number
        std: number;
        variance: number;
        min: number;
        max: number;
        quartiles: number[];
        missingValues: number;
        imputationMethod?: string;
      };
    };
    correlations: {
      pearson: { [key: string]: { [key: string]: number } };
      spearman: { [key: string]: { [key: string]: number } };
    };
    distributions: {
      [key: string]: {
        isNormal: boolean;
        skewness: number;
        kurtosis: number;
      };
    };
    numericalColumns: string[];
    categoricalColumns: string[];
  } | null;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  if (!data) return null;

  const formatNumber = (num: number) => Number(num.toFixed(4));

  const hasNumericalData = Object.keys(data.descriptive).length > 0;

  if (!hasNumericalData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Numerical Statistics Available</h2>
          <p className="text-gray-600">
            The selected dataset doesn't contain any numerical columns for statistical analysis.
            Please choose a dataset with numerical values.
          </p>
        </div>
      </div>
    );
  }

  const findExtremeValues = (stats: any) => {
    let maxValue = -Infinity;
    let minValue = Infinity;
    let maxColumn = '';
    let minColumn = '';

    Object.entries(stats).forEach(([column, columnStats]: [string, any]) => {
      if (columnStats.mean > maxValue) {
        maxValue = columnStats.mean;
        maxColumn = column;
      }
      if (columnStats.mean < minValue) {
        minValue = columnStats.mean;
        minColumn = column;
      }
    });

    return { maxColumn, minColumn };
  };

  const prepareBarData = () => {
    return Object.entries(data.descriptive).map(([column, stats]) => ({
      name: column,
      mean: formatNumber(stats.mean),
      median: formatNumber(stats.median),
      std: formatNumber(stats.std)
    }));
  };

  const prepareHeatmapData = () => {
    const columns = data.numericalColumns;
    const correlationData = {
      z: columns.map(col1 => 
        columns.map(col2 => data.correlations.pearson[col1][col2])
      ),
      x: columns,
      y: columns,
      type: 'heatmap',
      colorscale: 'RdBu'
    };
    return correlationData;
  };

  const { maxColumn, minColumn } = findExtremeValues(data.descriptive);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Descriptive Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Median</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing Values</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(data.descriptive).map(([column, stats]) => (
                <tr key={column}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    column === maxColumn ? 'text-green-800 font-semibold' : 
                    column === minColumn ? 'text-red-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {formatNumber(stats.mean)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.median)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.mode)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.std)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.variance)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.min)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.max)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.missingValues}
                    {stats.imputationMethod && ` (imputed with ${stats.imputationMethod})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Distribution Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skewness</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurtosis</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(data.distributions).map(([column, stats]) => (
                <tr key={column}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.isNormal ? 'Normal' : 'Non-normal'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.skewness)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(stats.kurtosis)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Correlation Heatmap</h2>
        <div className="w-full overflow-x-auto">
          <Plot
            data={[prepareHeatmapData()]}
            layout={{
              width: 800,
              height: 600,
              title: 'Pearson Correlation Matrix',
              xaxis: { side: 'bottom' },
              yaxis: { autorange: 'reversed' }
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Statistical Visualization</h2>
        <div className="w-full overflow-x-auto">
          <BarChart width={800} height={400} data={prepareBarData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mean" fill="#8884d8" name="Mean" />
            <Bar dataKey="median" fill="#82ca9d" name="Median" />
            <Bar dataKey="std" fill="#ffc658" name="Std Dev" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};