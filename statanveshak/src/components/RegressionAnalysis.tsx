import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as ss from 'simple-statistics';
import { AlertCircle } from 'lucide-react';

interface RegressionAnalysisProps {
  data: any;
}

export const RegressionAnalysis: React.FC<RegressionAnalysisProps> = ({ data }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetVariable, setTargetVariable] = useState<string>('');
  const [regressionResults, setRegressionResults] = useState<any>(null);
  const [notification, setNotification] = useState<string>('');
  const [modelType, setModelType] = useState<string>('linear');
  const [polynomialDegree, setPolynomialDegree] = useState<number>(2);

  const performRegression = () => {
    if (!data || !targetVariable || selectedFeatures.length === 0) {
      setNotification('Please select target and feature variables');
      return;
    }

    try {
      let X = selectedFeatures.map(feature => data.standardized[feature]);
      const y = data[targetVariable];

      if (!X[0] || !y) {
        setNotification('Invalid data for regression');
        return;
      }

      let regression;
      let yPred;
      let rSquared;

      if (modelType === 'polynomial' && selectedFeatures.length === 1) {
        // Generate polynomial features
        const x = X[0];
        X = Array.from({ length: polynomialDegree }, (_, i) => 
          x.map(val => Math.pow(val, i + 1))
        );
      }

      // Perform regression
      regression = ss.linearRegression(
        X[0].map((_, i) => X.map(col => col[i])),
        y
      );

      // Calculate predictions
      yPred = X[0].map((_, i) => 
        regression.b + X.reduce((sum, col, j) => 
          sum + regression.m[j] * col[i], 0
        )
      );

      // Calculate R-squared
      rSquared = 1 - ss.sumOfSquares(y.map((actual: number, i: number) => 
        actual - yPred[i]
      )) / ss.sumOfSquares(y.map((actual: number) => 
        actual - ss.mean(y)
      ));

      // Calculate adjusted R-squared
      const n = y.length;
      const p = X.length;
      const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1) / (n - p - 1));

      // Calculate feature importance
      const featureImportance = X.map((_, i) => ({
        feature: modelType === 'polynomial' ? `X^${i+1}` : selectedFeatures[i],
        coefficient: regression.m[i],
        standardizedCoef: regression.m[i] * (ss.standardDeviation(X[i]) / ss.standardDeviation(y))
      }));

      // Calculate residuals
      const residuals = y.map((actual: number, i: number) => actual - yPred[i]);
      const residualStats = {
        mean: ss.mean(residuals),
        std: ss.standardDeviation(residuals),
        normalityTest: Math.abs(ss.sampleSkewness(residuals)) < 0.5
      };

      // Calculate prediction intervals
      const mse = ss.mean(residuals.map(r => r * r));
      const predictionIntervals = yPred.map(pred => {
        const se = Math.sqrt(mse * (1 + 1/n));
        const t = 1.96; // Approximate for 95% confidence
        return {
          lower: pred - t * se,
          upper: pred + t * se
        };
      });

      setRegressionResults({
        coefficients: regression.m,
        intercept: regression.b,
        rSquared,
        adjustedRSquared,
        predictions: yPred,
        actualValues: y,
        featureImportance,
        residuals,
        residualStats,
        predictionIntervals,
        modelType,
        polynomialDegree: modelType === 'polynomial' ? polynomialDegree : null
      });

      setNotification('Regression analysis completed successfully');
    } catch (error) {
      setNotification('Error performing regression: ' + (error as Error).message);
    }
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
        <h2 className="text-2xl font-bold mb-4">Regression Analysis</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Target Variable
            </label>
            <select
              value={targetVariable}
              onChange={(e) => setTargetVariable(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select target variable...</option>
              {data?.numericalColumns?.map((col: string) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Feature Variables
            </label>
            <select
              multiple
              value={selectedFeatures}
              onChange={(e) => setSelectedFeatures(
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {data?.numericalColumns
                ?.filter((col: string) => col !== targetVariable)
                .map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="linear">Linear Regression</option>
              <option value="polynomial">Polynomial Regression</option>
            </select>
          </div>

          {modelType === 'polynomial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Polynomial Degree
              </label>
              <input
                type="number"
                min="2"
                max="5"
                value={polynomialDegree}
                onChange={(e) => setPolynomialDegree(parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={performRegression}
          disabled={!targetVariable || selectedFeatures.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Perform Regression
        </button>

        {regressionResults && (
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Model Summary</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="space-y-2">
                  <li>Model Type: {regressionResults.modelType}</li>
                  {regressionResults.polynomialDegree && (
                    <li>Polynomial Degree: {regressionResults.polynomialDegree}</li>
                  )}
                  <li>R-squared: {regressionResults.rSquared.toFixed(4)}</li>
                  <li>Adjusted R-squared: {regressionResults.adjustedRSquared.toFixed(4)}</li>
                  <li>Intercept: {regressionResults.intercept.toFixed(4)}</li>
                </ul>

                <div className="mt-4">
                  <p className="font-medium mb-2">Feature Importance:</p>
                  <ul className="space-y-1">
                    {regressionResults.featureImportance
                      .sort((a: any, b: any) => Math.abs(b.standardizedCoef) - Math.abs(a.standardizedCoef))
                      .map((feature: any) => (
                        <li key={feature.feature}>
                          {feature.feature}: {feature.standardizedCoef.toFixed(4)} (standardized)
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Residual Analysis:</p>
                  <ul className="space-y-1">
                    <li>Mean Residual: {regressionResults.residualStats.mean.toFixed(4)}</li>
                    <li>Residual Std: {regressionResults.residualStats.std.toFixed(4)}</li>
                    <li>Normality: {regressionResults.residualStats.normalityTest ? 'Normal' : 'Non-normal'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Actual vs Predicted Plot</h3>
              <Plot
                data={[
                  {
                    x: regressionResults.actualValues,
                    y: regressionResults.predictions,
                    type: 'scatter',
                    mode: 'markers',
                    name: 'Data Points',
                    marker: { color: 'blue' }
                  },
                  {
                    x: [
                      Math.min(...regressionResults.actualValues),
                      Math.max(...regressionResults.actualValues)
                    ],
                    y: [
                      Math.min(...regressionResults.actualValues),
                      Math.max(...regressionResults.actualValues)
                    ],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Perfect Prediction',
                    line: { color: 'red', dash: 'dash' }
                  }
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: 'Actual vs Predicted Values',
                  xaxis: { title: 'Actual Values' },
                  yaxis: { title: 'Predicted Values' }
                }}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Residual Plot</h3>
              <Plot
                data={[
                  {
                    x: regressionResults.predictions,
                    y: regressionResults.residuals,
                    type: 'scatter',
                    mode: 'markers',
                    name: 'Residuals',
                    marker: { color: 'blue' }
                  }
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: 'Residuals vs Predicted Values',
                  xaxis: { title: 'Predicted Values' },
                  yaxis: { title: 'Residuals' }
                }}
              />
            </div>

            {modelType === 'polynomial' && selectedFeatures.length === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Polynomial Fit</h3>
                <Plot
                  data={[
                    {
                      x: data[selectedFeatures[0]],
                      y: regressionResults.actualValues,
                      type: 'scatter',
                      mode: 'markers',
                      name: 'Data Points',
                      marker: { color: 'blue' }
                    },
                    {
                      x: data[selectedFeatures[0]],
                      y: regressionResults.predictions,
                      type: 'scatter',
                      mode: 'lines',
                      name: 'Polynomial Fit',
                      line: { color: 'red' }
                    }
                  ]}
                  layout={{
                    width: 500,
                    height: 500,
                    title: 'Polynomial Regression Fit',
                    xaxis: { title: selectedFeatures[0] },
                    yaxis: { title: targetVariable }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};