import Papa from 'papaparse';
import * as ss from 'simple-statistics';
import * as jStat from 'jstat';

interface DataAnalysis {
  [key: string]: number[];
  descriptive: {
    [key: string]: {
      mean: number;
      median: number;
      mode: number;
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
      bestFit: {
        type: string;
        parameters: any;
        chiSquare: number;
        description: string;
        videoUrl: string;
      };
    };
  };
  numericalColumns: string[];
  categoricalColumns: string[];
  standardized: { [key: string]: number[] };
}

const distributionInfo = {
  normal: {
    description: `The Normal Distribution is a continuous probability distribution that is symmetric about the mean. It's often called the "bell curve" due to its shape. Key properties:
    - Symmetric about the mean
    - Mean = Median = Mode
    - 68% of data within 1 standard deviation
    - 95% within 2 standard deviations
    - 99.7% within 3 standard deviations`,
    videoUrl: 'https://www.youtube.com/embed/rzFX5NWojp0'
  },
  exponential: {
    description: `The Exponential Distribution models the time between events in a Poisson point process. Key properties:
    - Memory-less property
    - Continuous distribution
    - Always positive
    - Decreasing probability density
    - Used for survival analysis and reliability testing`,
    videoUrl: 'https://www.youtube.com/embed/mHMh9KE4HDs'
  },
  uniform: {
    description: `The Uniform Distribution represents equal probability over a given interval. Key properties:
    - Constant probability density
    - Rectangular shape
    - Simple to understand and implement
    - Used in random number generation
    - All values in range equally likely`,
    videoUrl: 'https://www.youtube.com/embed/izrHUxqXvB4'
  },
  binomial: {
    description: `The Binomial Distribution models the number of successes in a fixed number of independent trials. Key properties:
    - Discrete distribution
    - Fixed number of trials
    - Independent trials
    - Constant probability of success
    - Used for yes/no experiments`,
    videoUrl: 'https://www.youtube.com/embed/8idr1WZ1A7Q'
  },
  poisson: {
    description: `The Poisson Distribution models the number of events occurring in a fixed interval of time or space. Key properties:
    - Discrete distribution
    - Events occur independently
    - Events occur at a constant rate
    - Used for rare event modeling
    - Mean equals variance`,
    videoUrl: 'https://www.youtube.com/embed/jmqZG6roVqU'
  }
};

export const analyzeFile = async (file: File): Promise<DataAnalysis> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: async (results) => {
        try {
          const { data, meta } = results;
          const columns = meta.fields || [];
          
          // Initialize data structure
          const numericalData: { [key: string]: number[] } = {};
          const standardizedData: { [key: string]: number[] } = {};
          const categoricalColumns: string[] = [];
          const processedData: DataAnalysis = {
            descriptive: {},
            correlations: { pearson: {}, spearman: {} },
            distributions: {},
            numericalColumns: [],
            categoricalColumns: [],
            standardized: {}
          };
          
          // Process each column
          columns.forEach(column => {
            const values = data.map(row => row[column]);
            const numericValues = values
              .map(v => parseFloat(v))
              .filter(v => !isNaN(v));
            
            if (numericValues.length > values.length * 0.5) {
              numericalData[column] = numericValues;
              processedData[column] = numericValues;
              processedData.numericalColumns.push(column);
              
              // Standardize the data
              const mean = ss.mean(numericValues);
              const std = ss.standardDeviation(numericValues);
              standardizedData[column] = numericValues.map(v => (v - mean) / std);
              processedData.standardized[column] = standardizedData[column];
              
              // Calculate descriptive statistics
              processedData.descriptive[column] = {
                mean,
                median: ss.median(numericValues),
                mode: ss.mode(numericValues),
                std,
                variance: ss.variance(numericValues),
                min: Math.min(...numericValues),
                max: Math.max(...numericValues),
                quartiles: [
                  ss.quantile(numericValues, 0.25),
                  ss.quantile(numericValues, 0.5),
                  ss.quantile(numericValues, 0.75)
                ],
                missingValues: values.length - numericValues.length
              };
            } else {
              categoricalColumns.push(column);
            }
          });
          
          processedData.categoricalColumns = categoricalColumns;

          // Calculate correlations using standardized data
          processedData.numericalColumns.forEach(col1 => {
            processedData.correlations.pearson[col1] = {};
            processedData.correlations.spearman[col1] = {};
            processedData.numericalColumns.forEach(col2 => {
              processedData.correlations.pearson[col1][col2] = 
                ss.sampleCorrelation(standardizedData[col1], standardizedData[col2]);
              processedData.correlations.spearman[col1][col2] = 
                calculateSpearmanCorrelation(standardizedData[col1], standardizedData[col2]);
            });
          });

          // Analyze distributions with improved fitting
          processedData.numericalColumns.forEach(column => {
            const values = numericalData[column];
            const skewness = ss.sampleSkewness(values);
            const kurtosis = ss.sampleKurtosis(values);
            
            // Find best fitting distribution
            const bestFit = findBestFitDistribution(values);
            
            processedData.distributions[column] = {
              isNormal: Math.abs(skewness) < 0.5 && Math.abs(kurtosis - 3) < 0.5,
              skewness,
              kurtosis,
              bestFit: {
                ...bestFit,
                description: distributionInfo[bestFit.type].description,
                videoUrl: distributionInfo[bestFit.type].videoUrl
              }
            };
          });

          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      },
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      error: (error) => reject(error)
    });
  });
};

function findBestFitDistribution(data: number[]) {
  const distributions = [
    {
      name: 'normal',
      fit: () => {
        const mean = ss.mean(data);
        const std = ss.standardDeviation(data);
        return {
          type: 'normal',
          parameters: { mean, std },
          chiSquare: calculateChiSquare(data, (x) => jStat.normal.pdf(x, mean, std))
        };
      }
    },
    {
      name: 'exponential',
      fit: () => {
        const rate = 1 / ss.mean(data);
        return {
          type: 'exponential',
          parameters: { rate },
          chiSquare: calculateChiSquare(data, (x) => jStat.exponential.pdf(x, rate))
        };
      }
    },
    {
      name: 'uniform',
      fit: () => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        return {
          type: 'uniform',
          parameters: { min, max },
          chiSquare: calculateChiSquare(data, (x) => jStat.uniform.pdf(x, min, max))
        };
      }
    }
  ];

  const fits = distributions.map(d => d.fit());
  return fits.reduce((best, current) => 
    current.chiSquare < best.chiSquare ? current : best
  );
}

function calculateChiSquare(data: number[], pdfFunction: (x: number) => number) {
  const bins = Math.ceil(Math.sqrt(data.length));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;
  
  const observed = new Array(bins).fill(0);
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    observed[binIndex]++;
  });
  
  const expected = new Array(bins).fill(0).map((_, i) => {
    const binCenter = min + (i + 0.5) * binWidth;
    return pdfFunction(binCenter) * binWidth * data.length;
  });
  
  return observed.reduce((sum, obs, i) => {
    const exp = expected[i];
    return sum + (exp > 0 ? Math.pow(obs - exp, 2) / exp : 0);
  }, 0);
}

function calculateSpearmanCorrelation(x: number[], y: number[]): number {
  const xRanks = calculateRanks(x);
  const yRanks = calculateRanks(y);
  return ss.sampleCorrelation(xRanks, yRanks);
}

function calculateRanks(arr: number[]): number[] {
  return arr
    .map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value)
    .map((v, i) => ({ ...v, rank: i + 1 }))
    .sort((a, b) => a.index - b.index)
    .map(v => v.rank);
}