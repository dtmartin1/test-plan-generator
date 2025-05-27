import React, { useState } from 'react';
import { formSteps } from './data/formSteps';
import { StepId } from './types';
import { openaiService } from './services/openai';
import { exportService } from './services/exportService';
import { useTestPlan } from './hooks/useTestPlan';
import ProgressBar from './components/ProgressBar';
import FormStep from './components/FormStep';
import SetupStep from './components/SetupStep';
import ReviewPlan from './components/ReviewPlan';

function App() {
  const {
    testPlan,
    enhancedFields,
    isEnhanced,
    handleInputChange,
    handleFileChange,
    markFieldAsEnhanced,
    markAllFieldsAsEnhanced,
    updateTestPlan,
  } = useTestPlan();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fieldBeingEnhanced, setFieldBeingEnhanced] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetSuggestions = async (field: string, value: string, stepId: StepId) => {
    setIsLoading(true);
    setError('');
    setFieldBeingEnhanced(field);
    try {
      // Skip if the field is empty
      if (!value.trim()) {
        setError(`Please add some content to the ${field} field before enhancing it`);
        setIsLoading(false);
        setFieldBeingEnhanced(null);
        return;
      }
      
      const newContent = await openaiService.generateSuggestions(field, value);
      console.log(`Received AI rewrite for field ${field}:`, newContent);
      
      // Update the field with the enhanced content
      updateFieldContent(stepId, field, newContent);
      
      // Mark this field as enhanced
      markFieldAsEnhanced(stepId, field);
      
    } catch (error) {
      console.error('Error rewriting content:', error);
      setError(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
      setFieldBeingEnhanced(null);
    }
  };

  const handleEnhanceTestPlan = async () => {
    setIsLoading(true);
    setError('');
    try {
      const enhancedPlan = await openaiService.enhanceTestPlan(testPlan);
      updateTestPlan(enhancedPlan);
      markAllFieldsAsEnhanced();
    } catch (error) {
      console.error('Error enhancing test plan:', error);
      setError(`Failed to enhance test plan: ${formatErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to update field content based on step ID
  const updateFieldContent = (stepId: StepId, field: string, content: string) => {
    if (stepId === 'context') {
      updateTestPlan({ ...testPlan, context: content });
    } else if (stepId === 'hypothesis') {
      updateTestPlan({ ...testPlan, hypothesis: content });
    } else if (stepId === 'impact') {
      updateTestPlan({ ...testPlan, expectedImpact: content });
    } else if (stepId === 'setup') {
      updateTestPlan({
        ...testPlan,
        experimentSetup: {
          ...testPlan.experimentSetup,
          [field]: content,
        },
      });
    } else if (stepId === 'metrics') {
      if (field === 'secondaryMetrics') {
        updateTestPlan({
          ...testPlan,
          metrics: {
            ...testPlan.metrics,
            secondaryMetrics: content.split(',').map(item => item.trim()),
          },
        });
      } else {
        updateTestPlan({
          ...testPlan,
          metrics: {
            ...testPlan.metrics,
            [field]: content,
          },
        });
      }
    } else if (stepId === 'variants') {
      updateTestPlan({
        ...testPlan,
        variants: {
          ...testPlan.variants,
          [field]: content,
        },
      });
    } else if (stepId === 'conclusions') {
      updateTestPlan({
        ...testPlan,
        conclusions: {
          ...testPlan.conclusions,
          [field]: content,
        },
      });
    }
  };

  // Helper function to format error messages consistently
  const formatErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else if (error && typeof error === 'object') {
      return JSON.stringify(error);
    }
    return 'Unknown error occurred';
  };

  const handleExportPDF = () => {
    exportService.exportToPDF(testPlan);
  };

  const handleExportSlides = () => {
    exportService.exportToSlides(testPlan);
  };

  const renderForm = () => {
    if (currentStep >= formSteps.length) {
      return (
        <ReviewPlan
          testPlan={testPlan}
          isEnhanced={isEnhanced}
          error={error}
          onPrevious={handlePrevious}
          onExportPDF={handleExportPDF}
          onExportSlides={handleExportSlides}
        />
      );
    }

    const currentFormStep = formSteps[currentStep];
    
    // Use a specialized setup step component for the experiment setup screen
    if (currentFormStep.id === 'setup') {
      return (
        <SetupStep
          step={currentFormStep}
          values={testPlan}
          enhancedFields={enhancedFields}
          fieldBeingEnhanced={fieldBeingEnhanced}
          isLoading={isLoading}
          error={error}
          currentStep={currentStep}
          onInputChange={handleInputChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    return (
      <FormStep
        step={currentFormStep}
        values={testPlan}
        enhancedFields={enhancedFields}
        fieldBeingEnhanced={fieldBeingEnhanced}
        isLoading={isLoading}
        error={error}
        currentStep={currentStep}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onGetSuggestions={handleGetSuggestions}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  };

  // Calculate steps for progress bar
  const totalSteps = formSteps.length + 1; // +1 for the review step

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Test Plan Generator</h1>
          <p className="text-gray-600">Create comprehensive test plans with AI assistance</p>
        </header>
        
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
        
        {renderForm()}
      </div>
    </div>
  );
}

export default App;