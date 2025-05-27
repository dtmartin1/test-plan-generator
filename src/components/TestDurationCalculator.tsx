import React, { useState, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import { 
  calculateSampleSize, 
  calculateTestDuration, 
  calculateBaselineConversionRate,
  formatSampleSize,
  formatTestDuration
} from '../utils/testCalculator';

interface TestDurationCalculatorProps {
  onCalculate: (sampleSize: string, duration: string, rawSampleSize?: number) => void;
}

const TestDurationCalculator: React.FC<TestDurationCalculatorProps> = ({ 
  onCalculate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [baselineConversionRate, setBaselineConversionRate] = useState<string>('');
  const [minimumDetectableEffect, setMinimumDetectableEffect] = useState<string>('10');
  const [weeklyUsers, setWeeklyUsers] = useState<string>('');
  const [weeklyConversions, setWeeklyConversions] = useState<string>('');
  const [numberOfVariants, setNumberOfVariants] = useState<string>('2');
  const [calculatedSampleSize, setCalculatedSampleSize] = useState<number | null>(null);
  const [calculatedDuration, setCalculatedDuration] = useState<number | null>(null);
  const [calculationError, setCalculationError] = useState<string>('');

  // Handle weekly metrics change to calculate the baseline conversion rate
  const handleWeeklyMetricsChange = (type: 'users' | 'conversions', value: string) => {
    if (type === 'users') {
      setWeeklyUsers(value);
    } else {
      setWeeklyConversions(value);
    }

    // Only calculate baseline if both values are present
    const users = type === 'users' ? parseFloat(value) : parseFloat(weeklyUsers);
    const conversions = type === 'conversions' ? parseFloat(value) : parseFloat(weeklyConversions);
    
    if (!isNaN(users) && !isNaN(conversions) && users > 0) {
      const rate = calculateBaselineConversionRate(conversions, users);
      setBaselineConversionRate(rate.toFixed(2));
    }
  };

  // Manual calculation when user clicks calculate button
  const handleCalculateClick = useCallback(() => {
    setCalculationError('');
    
    try {
      // Validate inputs
      const baseline = parseFloat(baselineConversionRate);
      const mde = parseFloat(minimumDetectableEffect);
      const users = parseFloat(weeklyUsers);
      const variants = parseInt(numberOfVariants) || 2;
      
      if (isNaN(baseline) || baseline <= 0 || baseline >= 100) {
        throw new Error('Baseline conversion rate must be between 0 and 100%');
      }
      
      if (isNaN(mde) || mde <= 0) {
        throw new Error('Minimum detectable effect must be a positive number');
      }
      
      if (isNaN(users) || users <= 0) {
        throw new Error('Weekly users must be a positive number');
      }
      
      if (variants < 2 || variants > 10) {
        throw new Error('Number of variants must be between 2 and 10');
      }
      
      // Calculate sample size and duration
      const sampleSize = calculateSampleSize(baseline, mde, 0.95, 0.80, variants);
      const duration = calculateTestDuration(sampleSize, users, variants);
      
      // Update local state
      setCalculatedSampleSize(sampleSize);
      setCalculatedDuration(duration);
      
      // Format the values for displaying in the UI
      const formattedSampleSize = formatSampleSize(sampleSize);
      const formattedDuration = formatTestDuration(duration);
      
      // Notify parent component of the calculation results
      onCalculate(formattedSampleSize, formattedDuration, sampleSize);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Calculation error';
      setCalculationError(message);
      console.error('Test duration calculation error:', error);
    }
  }, [baselineConversionRate, minimumDetectableEffect, weeklyUsers, numberOfVariants, onCalculate]);

  // Handle variant count input
  const handleVariantCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Allow empty input for typing
    if (value === '') {
      setNumberOfVariants('');
      return;
    }
    
    // Validate number is between 2 and 10
    if (!isNaN(numValue)) {
      if (numValue < 2) {
        setNumberOfVariants('2');
      } else if (numValue > 10) {
        setNumberOfVariants('10');
      } else {
        setNumberOfVariants(numValue.toString());
      }
    }
  };

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Calculator className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">
            Test Duration Calculator
          </h3>
        </div>
        <div className="text-gray-500">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Enter your metrics to calculate the required sample size and test duration based on statistical significance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Traffic Metrics</h4>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Total Users
                </label>
                <input
                  type="number"
                  value={weeklyUsers}
                  onChange={(e) => handleWeeklyMetricsChange('users', e.target.value)}
                  placeholder="e.g., 10000"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Conversions
                </label>
                <input
                  type="number"
                  value={weeklyConversions}
                  onChange={(e) => handleWeeklyMetricsChange('conversions', e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Variants (including control)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={numberOfVariants}
                  onChange={handleVariantCountChange}
                  placeholder="2-10"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min: 2, Max: 10 variants
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Statistical Parameters</h4>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baseline Conversion Rate (%)
                </label>
                <input
                  type="number"
                  value={baselineConversionRate}
                  onChange={(e) => setBaselineConversionRate(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {weeklyUsers && weeklyConversions && (
                  <p className="text-xs text-gray-500 mt-1">
                    Calculated from your weekly metrics.
                  </p>
                )}
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Detectable Effect (% relative change)
                </label>
                <input
                  type="number"
                  value={minimumDetectableEffect}
                  onChange={(e) => setMinimumDetectableEffect(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statistical Parameters
                  </label>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Significance Level:</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statistical Power:</span>
                    <span className="font-medium">80%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {calculationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
              {calculationError}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleCalculateClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate
            </button>
            
            {calculatedSampleSize && calculatedDuration && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">
                  Sample Size per Variant: <span className="text-blue-600">{formatSampleSize(calculatedSampleSize)}</span>
                </p>
                <p className="font-medium text-gray-700">
                  Estimated Duration: <span className="text-blue-600">{formatTestDuration(calculatedDuration)}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDurationCalculator;