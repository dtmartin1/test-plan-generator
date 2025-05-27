import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FormField from './FormField';
import TestDurationCalculator from './TestDurationCalculator';
import { StepId } from '../types';

interface SetupStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    fields: {
      id: string;
      label: string;
      type: 'text' | 'textarea' | 'number' | 'select' | 'file';
      placeholder?: string;
      required?: boolean;
      options?: { value: string; label: string }[];
    }[];
  };
  values: Record<string, any>;
  enhancedFields: Set<string>;
  fieldBeingEnhanced: string | null;
  isLoading: boolean;
  error: string;
  currentStep: number;
  onInputChange: (id: string, value: string, step: StepId) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SetupStep: React.FC<SetupStepProps> = ({
  step,
  values,
  enhancedFields,
  fieldBeingEnhanced,
  isLoading,
  error,
  currentStep,
  onInputChange,
  onNext,
  onPrevious,
}) => {
  const stepId = step.id as StepId;
  
  // Store calculator results locally to ensure immediate display
  const [calculatorResults, setCalculatorResults] = useState<{
    sampleSize: string;
    duration: string;
  }>({
    sampleSize: values.experimentSetup?.sampleSize || '',
    duration: values.experimentSetup?.duration || ''
  });

  // Memoize the calculator results handler to prevent it from changing on every render
  const handleCalculatorResults = useCallback((sampleSize: string, duration: string, rawSampleSize?: number) => {
    console.log('Calculator results:', { sampleSize, duration, rawSampleSize });
    
    // Update local state for immediate display in form fields
    setCalculatorResults({
      sampleSize: sampleSize,
      duration: duration
    });
    
    // Also update the parent's state (for saving to overall test plan)
    onInputChange('sampleSize', sampleSize, 'setup');
    onInputChange('duration', duration, 'setup');
  }, [onInputChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      <TestDurationCalculator onCalculate={handleCalculatorResults} />

      {step.fields.map((field) => {
        // Use the local state for immediate display, falling back to the parent state
        let value = '';
        
        if (stepId === 'setup') {
          if (field.id === 'sampleSize') {
            value = calculatorResults.sampleSize || values.experimentSetup?.[field.id] || '';
          } else if (field.id === 'duration') {
            value = calculatorResults.duration || values.experimentSetup?.[field.id] || '';
          } else {
            value = values.experimentSetup?.[field.id] || '';
          }
        }

        const isFieldEnhanced = enhancedFields.has(`${stepId}-${field.id}`);
        const isCurrentFieldBeingEnhanced = fieldBeingEnhanced === field.id;

        return (
          <FormField
            key={field.id}
            field={field}
            value={value}
            isEnhanced={isFieldEnhanced}
            isBeingEnhanced={isCurrentFieldBeingEnhanced}
            isLoading={isLoading}
            onChange={(value) => {
              // Update both local state and parent state
              if (field.id === 'sampleSize') {
                setCalculatorResults(prev => ({ ...prev, sampleSize: value }));
              } else if (field.id === 'duration') {
                setCalculatorResults(prev => ({ ...prev, duration: value }));
              }
              onInputChange(field.id, value, stepId);
            }}
            showEnhanceButton={false}
          />
        );
      })}

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <h3 className="font-semibold mb-2 text-red-700">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        
        <button
          onClick={onNext}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SetupStep;