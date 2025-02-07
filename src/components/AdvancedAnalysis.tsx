import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as ss from 'simple-statistics';
import { AlertCircle } from 'lucide-react';

interface AdvancedAnalysisProps {
  data: any;
}

export const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ data }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedCategorical, setSelectedCategorical] = useState<string>('');
  const [notification, setNotification] = useState<string>('');
  const [visualizations, setVisualizations] = useState<any[]>([]);

  useEffect(() => {
    if (data && selectedColumns.length > 0) {
      generateVisualizations();
    }
  }, [data, selectedColumns, selectedCategorical]);

  const calculateRSquared = (x: number[], y: number[], regression: { b: number, m: number }) => {
    const yMean = ss.mean(y);
    const predictedY = x.map(xi => regression.m * xi + regression.b);
    const residualSS = ss.sum(y.map((yi, i) => Math.pow(yi - predictedY[i], 2)));
    const totalSS = ss.sum(y.map(yi => Math.pow(yi - yMean, 2)));
    return 1 - (residualSS / totalSS);
  };

  const generateVisualizations = () => {
    if (!data || !selectedColumns.length) return;

    const plots = [];

    // Bar Chart for categorical data
    if (selectedCategorical && selectedColumns[0]) {
      const categories = [...new Set(data[selectedCategorical])];
      const values = categories.map(cat => {
        const categoryValues = data[selectedColumns[0]].filter((_: any, i: number) => 
          data[selectedCategorical][i] === cat
        );
        return ss.mean(categoryValues);
      });

      plots.push({
        type: 'bar',
        data: [{
          x: categories,
          y: values,
          type: 'bar',
          name: 'Category Means'
        }],
        layout: {
          title: `Mean ${selectedColumns[0]} by ${selectedCategorical}`,
          xaxis: { title: selectedCategorical },
          yaxis: { title: `Mean ${selectedColumns[0]}` }
        }
      });
    }

    // Line Chart (Time Series)
    if (selectedColumns.length >= 1) {
      const timeData = Array.from({ length: data[selectedColumns[0]].length }, (_, i) => i);
      const traces = selectedColumns.map(col => ({
        x: timeData,
        y: data[col],
        type: 'scatter',
        mode: 'lines+markers',
        name: col
      }));

      plots.push({
        type: 'line',
        data: traces,
        layout: {
          title: 'Time Series Analysis',
          xaxis: { title: 'Time Point' },
          yaxis: { title: 'Value' }
        }
      });
    }

    // Histogram
    if (selectedColumns.length >= 1) {
      plots.push({
        type: 'histogram',
        data: [{
          x: data[selectedColumns[0]],
          type: 'histogram',
          nbinsx: Math.ceil(Math.sqrt(data[selectedColumns[0]].length)),
          name: selectedColumns[0]
        }],
        layout: {
          title: `Distribution of ${selectedColumns[0]}`,
          xaxis: { title: selectedColumns[0] },
          yaxis: { title: 'Frequency' }
        }
      });
    }

    // Scatter Plot with Regression
    if (selectedColumns.length >= 2) {
      const x = data[selectedColumns[0]];
      const y = data[selectedColumns[1]];
      const regression = ss.linearRegression(x.map((val: number, i: number) => [val, y[i]]));
      const rSquared = calculateRSquared(x, y, regression);
      
      plots.push({
        type: 'scatter',
        data: [
          {
            x,
            y,
            mode: 'markers',
            type: 'scatter',
            name: 'Data Points'
          },
          {
            x: [Math.min(...x), Math.max(...x)],
            y: [
              regression.m * Math.min(...x) + regression.b,
              regression.m * Math.max(...x) + regression.b
            ],
            mode: 'lines',
            type: 'scatter',
            name: `Regression Line (R² = ${rSquared.toFixed(3)})`
          }
        ],
        layout: {
          title: `${selectedColumns[1]} vs ${selectedColumns[0]}`,
          xaxis: { title: selectedColumns[0] },
          yaxis: { title: selectedColumns[1] }
        }
      });
    }

    // Box Plot
    if (selectedCategorical && selectedColumns[0]) {
      const categories = [...new Set(data[selectedCategorical])];
      const traces = categories.map(cat => ({
        y: data[selectedColumns[0]].filter((_: any, i: number) => 
          data[selectedCategorical][i] === cat
        ),
        type: 'box',
        name: String(cat)
      }));

      plots.push({
        type: 'box',
        data: traces,
        layout: {
          title: `Distribution by ${selectedCategorical}`,
          yaxis: { title: selectedColumns[0] }
        }
      });
    }

    // Correlation Heatmap
    if (selectedColumns.length > 1) {
      const correlationMatrix = selectedColumns.map(col1 => 
        selectedColumns.map(col2 => 
          ss.sampleCorrelation(data[col1], data[col2])
        )
      );

      plots.push({
        type: 'heatmap',
        data: [{
          z: correlationMatrix,
          x: selectedColumns,
          y: selectedColumns,
          type: 'heatmap',
          colorscale: 'RdBu'
        }],
        layout: {
          title: 'Correlation Heatmap',
          width: 500,
          height: 500
        }
      });
    }

    setVisualizations(plots);
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{notification}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Advanced Statistical Analysis</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Numerical Columns
            </label>
            <select
              multiple
              value={selectedColumns}
              onChange={(e) => setSelectedColumns(
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {data?.numericalColumns?.map((col: string) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Categorical Column (Optional)
            </label>
            <select
              value={selectedCategorical}
              onChange={(e) => setSelectedCategorical(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">None</option>
              {data?.categoricalColumns?.map((col: string) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {visualizations.map((viz, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <Plot
                data={viz.data}
                layout={{
                  ...viz.layout,
                  width: 500,
                  height: 400,
                  margin: { l: 50, r: 50, t: 50, b: 50 }
                }}
                config={{ responsive: true }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};