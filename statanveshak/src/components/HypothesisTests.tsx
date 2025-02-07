import React, { useState } from 'react';
import * as ss from 'simple-statistics';
import * as jStat from 'jstat';
import Plot from 'react-plotly.js';
import { AlertCircle } from 'lucide-react';

interface HypothesisTestsProps {
  data: any;
}

export const HypothesisTests: React.FC<HypothesisTestsProps> = ({ data }) => {
  const [selectedTest, setSelectedTest] = useState<string>('ttest');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedColumn2, setSelectedColumn2] = useState<string>('');
  const [selectedCategorical, setSelectedCategorical] = useState<string>('');
  const [testResults, setTestResults] = useState<any>(null);
  const [notification, setNotification] = useState<string>('');

  const tests = [
    { 
      id: 'ttest', 
      name: 'T-Test',
      description: 'Tests if the mean of a population differs significantly from a hypothesized value or another population mean.',
      video: 'https://www.youtube.com/embed/0Pd3dc1GcHc'
    },
    { 
      id: 'ztest', 
      name: 'Z-Test',
      description: 'Used when the population standard deviation is known and the sample size is large.',
      video: 'https://www.youtube.com/embed/5ABpqVSx33I'
    },
    {
      id: 'anova',
      name: 'ANOVA',
      description: 'Analysis of Variance tests differences among group means.',
      video: 'https://www.youtube.com/embed/0Pd3dc1GcHc'
    }
  ];

  const performTest = () => {
    if (!selectedColumn || !data || !data[selectedColumn]) {
      setNotification('Please select required columns for the test');
      return;
    }

    try {
      const values = data[selectedColumn];
      let results: any = {};

      switch (selectedTest) {
        case 'ttest':
          if (selectedColumn2 && data[selectedColumn2]) {
            const values2 = data[selectedColumn2];
            const { statistic, pValue } = tTest(values, values2);
            results = {
              type: 'Two-sample t-test',
              statistic,
              pValue,
              degreesOfFreedom: values.length + values2.length - 2
            };
          } else {
            const { statistic, pValue } = tTest(values);
            results = {
              type: 'One-sample t-test',
              statistic,
              pValue,
              degreesOfFreedom: values.length - 1
            };
          }
          break;

        case 'ztest':
          const { statistic, pValue } = zTest(values);
          results = {
            type: 'Z-test',
            statistic,
            pValue
          };
          break;

        case 'anova':
          if (!selectedCategorical) {
            setNotification('Please select a categorical variable for ANOVA');
            return;
          }
          const anovaResults = performANOVA(values, data[selectedCategorical]);
          results = {
            type: 'One-way ANOVA',
            ...anovaResults
          };
          break;
      }

      setTestResults(results);
      setNotification('Test performed successfully');
    } catch (error) {
      setNotification('Error performing test: ' + (error as Error).message);
    }
  };

  const performANOVA = (values: number[], groups: any[]) => {
    const uniqueGroups = [...new Set(groups)];
    const groupedData = uniqueGroups.map(group => 
      values.filter((_, i) => groups[i] === group)
    );

    // Calculate group means and overall mean
    const groupMeans = groupedData.map(group => ss.mean(group));
    const allValues = groupedData.flat();
    const overallMean = ss.mean(allValues);

    // Calculate SS (Sum of Squares)
    const SSB = groupedData.reduce((sum, group, i) => 
      sum + group.length * Math.pow(groupMeans[i] - overallMean, 2), 0
    );

    const SSW = groupedData.reduce((sum, group, i) => 
      sum + group.reduce((s, val) => 
        s + Math.pow(val - groupMeans[i], 2), 0
      ), 0
    );

    const SST = SSB + SSW;

    // Calculate degrees of freedom
    const dfB = uniqueGroups.length - 1;
    const dfW = allValues.length - uniqueGroups.length;
    const dfT = allValues.length - 1;

    // Calculate Mean Squares
    const MSB = SSB / dfB;
    const MSW = SSW / dfW;

    // Calculate F-statistic
    const fStat = MSB / MSW;

    // Calculate p-value
    const pValue = 1 - jStat.centralF.cdf(fStat, dfB, dfW);

    return {
      fStatistic: fStat,
      pValue,
      dfBetween: dfB,
      dfWithin: dfW,
      SSB,
      SSW,
      MSB,
      MSW,
      groupMeans: uniqueGroups.map((group, i) => ({
        group,
        mean: groupMeans[i],
        n: groupedData[i].length
      }))
    };
  };

  // Existing test implementations...
  const tTest = (sample1: number[], sample2?: number[]) => {
    if (sample2) {
      const mean1 = ss.mean(sample1);
      const mean2 = ss.mean(sample2);
      const var1 = ss.variance(sample1);
      const var2 = ss.variance(sample2);
      const n1 = sample1.length;
      const n2 = sample2.length;
      
      const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
      const statistic = (mean1 - mean2) / Math.sqrt(pooledVar * (1/n1 + 1/n2));
      const df = n1 + n2 - 2;
      
      const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(statistic), df));
      return { statistic, pValue };
    } else {
      const mean = ss.mean(sample1);
      const std = ss.standardDeviation(sample1);
      const n = sample1.length;
      
      const statistic = mean / (std / Math.sqrt(n));
      const df = n - 1;
      
      const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(statistic), df));
      return { statistic, pValue };
    }
  };

  const zTest = (sample: number[]) => {
    const mean = ss.mean(sample);
    const std = ss.standardDeviation(sample);
    const n = sample.length;
    
    const statistic = mean / (std / Math.sqrt(n));
    const pValue = 2 * (1 - jStat.normal.cdf(Math.abs(statistic), 0, 1));
    
    return { statistic, pValue };
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
        <h2 className="text-2xl font-bold mb-4">Hypothesis Testing</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Test
            </label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {tests.map(test => (
                <option key={test.id} value={test.id}>{test.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Primary Column
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

          {selectedTest === 'ttest' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Secondary Column (Optional)
              </label>
              <select
                value={selectedColumn2}
                onChange={(e) => setSelectedColumn2(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">None (One-sample test)</option>
                {data?.numericalColumns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {selectedTest === 'anova' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Categorical Variable
              </label>
              <select
                value={selectedCategorical}
                onChange={(e) => setSelectedCategorical(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a categorical variable...</option>
                {data?.categoricalColumns?.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={performTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Perform Test
        </button>

        {testResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Test Results</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">{testResults.type}</p>
              <ul className="space-y-2">
                {testResults.type === 'One-way ANOVA' ? (
                  <>
                    <li>F-statistic: {testResults.fStatistic.toFixed(4)}</li>
                    <li>P-value: {testResults.pValue.toFixed(4)}</li>
                    <li>Degrees of Freedom (between): {testResults.dfBetween}</li>
                    <li>Degrees of Freedom (within): {testResults.dfWithin}</li>
                    <li>Mean Square (between): {testResults.MSB.toFixed(4)}</li>
                    <li>Mean Square (within): {testResults.MSW.toFixed(4)}</li>
                    <li className="mt-2 font-medium">Group Means:</li>
                    {testResults.groupMeans.map((group: any) => (
                      <li key={group.group} className="ml-4">
                        {group.group}: {group.mean.toFixed(4)} (n={group.n})
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    <li>Test Statistic: {testResults.statistic.toFixed(4)}</li>
                    <li>P-value: {testResults.pValue.toFixed(4)}</li>
                    {testResults.degreesOfFreedom && (
                      <li>Degrees of Freedom: {testResults.degreesOfFreedom}</li>
                    )}
                  </>
                )}
              </ul>
              <div className="mt-4 p-3 rounded border border-gray-200">
                <p className="font-medium">Conclusion:</p>
                <p>
                  {testResults.pValue < 0.05 
                    ? 'Reject the null hypothesis (statistically significant difference found)'
                    : 'Fail to reject the null hypothesis (no statistically significant difference found)'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};