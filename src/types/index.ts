export interface TestPlan {
  context: string;
  hypothesis: string;
  expectedImpact: string;
  experimentSetup: {
    sampleSize: string;
    duration: string;
    significance: string;
    power: string;
  };
  metrics: {
    primary: string;
    secondaryMetrics: string[];
    registrationStart: string;
    registrationComplete: string;
  };
  variants: {
    control: string;
    variantA: string;
    controlImage?: string | null;
    variantAImage?: string | null;
  };
  conclusions: {
    summary: string;
    outcome: string;
    significant: string;
    primaryGoal: string;
    controlRate: string;
    testRate: string;
    relativeChange: string;
    confidenceLevel: string;
    nextSteps: string;
    notes: string;
  };
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file';
  placeholder?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export type StepId = 
  | 'context' 
  | 'hypothesis' 
  | 'impact' 
  | 'setup' 
  | 'metrics' 
  | 'variants' 
  | 'conclusions' 
  | 'review';