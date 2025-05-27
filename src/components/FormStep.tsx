import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FormField from './FormField';
import { StepId } from '../types';

interface FormStepProps {
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
  onFileChange: (id: string, file: File | null) => void;
  onGetSuggestions: (field: string, value: string, stepId: StepId) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FormStep: React.FC<FormStepProps> = ({
  step,
  values,
  enhancedFields,
  fieldBeingEnhanced,
  isLoading,
  error,
  currentStep,
  onInputChange,
  onFileChange,
  onGetSuggestions,
  onNext,
  onPrevious,
}) => {
  const stepId = step.id as StepId;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      {step.fields.map((field) => {
        let value = '';
        
        if (stepId === 'context') {
          value = values.context;
        } else if (stepId === 'hypothesis') {
          value = values.hypothesis;
        } else if (stepId === 'impact') {
          value = values.expectedImpact;
        } else if (stepId === 'setup') {
          value = values.experimentSetup[field.id];
        } else if (stepId === 'metrics') {
          if (field.id === 'secondaryMetrics') {
            value = values.metrics.secondaryMetrics.join(', ');
          } else {
            value = values.metrics[field.id];
          }
        } else if (stepId === 'variants') {
          if (field.id === 'controlImage' || field.id === 'variantAImage') {
            value = '';
          } else {
            value = values.variants[field.id];
          }
        } else if (stepId === 'conclusions') {
          value = values.conclusions[field.id];
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
            onChange={(value) => onInputChange(field.id, value, stepId)}
            onFileChange={field.type === 'file' ? (file) => onFileChange(field.id, file) : undefined}
            onEnhance={() => onGetSuggestions(field.id, value, stepId)}
            showEnhanceButton={stepId !== 'setup'}
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

export default FormStep;