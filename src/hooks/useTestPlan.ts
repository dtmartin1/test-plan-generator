import { useState, useEffect } from 'react';
import { TestPlan, StepId } from '../types';
import { formSteps } from '../data/formSteps';

const initialTestPlan: TestPlan = {
  context: '',
  hypothesis: '',
  expectedImpact: '',
  experimentSetup: {
    sampleSize: '',
    duration: '',
    significance: '95%',
    power: '80%',
  },
  metrics: {
    primary: '',
    secondaryMetrics: [],
    registrationStart: '',
    registrationComplete: '',
  },
  variants: {
    control: '',
    variantA: '',
    controlImage: null,
    variantAImage: null,
  },
  conclusions: {
    summary: '',
    outcome: '',
    significant: '',
    primaryGoal: '',
    controlRate: '',
    testRate: '',
    relativeChange: '',
    confidenceLevel: '',
    nextSteps: '',
    notes: '',
  },
};

export const useTestPlan = () => {
  const [testPlan, setTestPlan] = useState<TestPlan>(initialTestPlan);
  const [enhancedFields, setEnhancedFields] = useState<Set<string>>(new Set());
  const [isEnhanced, setIsEnhanced] = useState<boolean>(false);

  // Initialize default values from formSteps
  useEffect(() => {
    const updatedTestPlan = { ...testPlan };
    
    formSteps.forEach(step => {
      if (step.id === 'setup') {
        step.fields.forEach(field => {
          if (field.defaultValue && !testPlan.experimentSetup[field.id as keyof typeof testPlan.experimentSetup]) {
            updatedTestPlan.experimentSetup[field.id as keyof typeof testPlan.experimentSetup] = field.defaultValue;
          }
        });
      }
    });
    
    setTestPlan(updatedTestPlan);
  }, []);

  const handleInputChange = (id: string, value: string, step: StepId) => {
    // When a user manually edits a field, remove it from the enhanced fields set
    const newEnhancedFields = new Set(enhancedFields);
    newEnhancedFields.delete(`${step}-${id}`);
    setEnhancedFields(newEnhancedFields);
    
    // Update test plan based on step ID
    let updatedTestPlan = { ...testPlan };
    
    switch (step) {
      case 'context':
        updatedTestPlan.context = value;
        break;
      case 'hypothesis':
        updatedTestPlan.hypothesis = value;
        break;
      case 'impact':
        updatedTestPlan.expectedImpact = value;
        break;
      case 'setup':
        updatedTestPlan.experimentSetup = {
          ...updatedTestPlan.experimentSetup,
          [id]: value,
        };
        break;
      case 'metrics':
        if (id === 'secondaryMetrics') {
          updatedTestPlan.metrics = {
            ...updatedTestPlan.metrics,
            secondaryMetrics: value.split(',').map(item => item.trim()),
          };
        } else {
          updatedTestPlan.metrics = {
            ...updatedTestPlan.metrics,
            [id]: value,
          };
        }
        break;
      case 'variants':
        updatedTestPlan.variants = {
          ...updatedTestPlan.variants,
          [id]: value,
        };
        break;
      case 'conclusions':
        updatedTestPlan.conclusions = {
          ...updatedTestPlan.conclusions,
          [id]: value,
        };
        break;
    }
    
    setTestPlan(updatedTestPlan);
  };

  const handleFileChange = (id: string, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setTestPlan({
          ...testPlan,
          variants: {
            ...testPlan.variants,
            [id]: e.target.result as string,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const markFieldAsEnhanced = (stepId: StepId, fieldId: string) => {
    const newEnhancedFields = new Set(enhancedFields);
    newEnhancedFields.add(`${stepId}-${fieldId}`);
    setEnhancedFields(newEnhancedFields);
  };

  const markAllFieldsAsEnhanced = () => {
    const allFields = new Set<string>();
    formSteps.forEach(step => {
      step.fields.forEach(field => {
        allFields.add(`${step.id}-${field.id}`);
      });
    });
    setEnhancedFields(allFields);
    setIsEnhanced(true);
  };

  const updateTestPlan = (newTestPlan: TestPlan) => {
    setTestPlan(newTestPlan);
  };

  return {
    testPlan,
    enhancedFields,
    isEnhanced,
    handleInputChange,
    handleFileChange,
    markFieldAsEnhanced,
    markAllFieldsAsEnhanced,
    updateTestPlan,
    setIsEnhanced,
  };
};