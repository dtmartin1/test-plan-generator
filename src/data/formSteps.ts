import { FormStep } from '../types';

export const formSteps: FormStep[] = [
  {
    id: 'context',
    title: 'Context',
    description: 'Provide background information about the test',
    fields: [
      {
        id: 'context',
        label: 'What is the context of this test?',
        type: 'textarea',
        placeholder: 'Describe the background and purpose of this test...',
        required: false,
      },
    ],
  },
  {
    id: 'hypothesis',
    title: 'Hypothesis',
    description: 'Define your hypothesis for this test',
    fields: [
      {
        id: 'hypothesis',
        label: 'What is your hypothesis?',
        type: 'textarea',
        placeholder: 'If we [action], then we will [expected outcome]...',
        required: false,
      },
    ],
  },
  {
    id: 'impact',
    title: 'Expected Impact',
    description: 'Quantify the expected impact',
    fields: [
      {
        id: 'expectedImpact',
        label: 'What is the expected impact?',
        type: 'text',
        placeholder: 'e.g., 5% relative increase',
        required: false,
      },
    ],
  },
  {
    id: 'setup',
    title: 'Experiment Setup',
    description: 'Define the parameters of your experiment',
    fields: [
      {
        id: 'sampleSize',
        label: 'Sample Size per Variant',
        type: 'text',
        placeholder: 'e.g., 2,784',
        required: false,
      },
      {
        id: 'duration',
        label: 'Expected Duration',
        type: 'text',
        placeholder: 'e.g., 4 weeks',
        required: false,
      },
      {
        id: 'significance',
        label: 'Statistical Significance',
        type: 'text',
        placeholder: 'e.g., 95%',
        defaultValue: '95%',
        required: false,
      },
      {
        id: 'power',
        label: 'Statistical Power',
        type: 'text',
        placeholder: 'e.g., 80%',
        defaultValue: '80%',
        required: false,
      },
    ],
  },
  {
    id: 'metrics',
    title: 'Success Metrics',
    description: 'Define the metrics you will track',
    fields: [
      {
        id: 'primary',
        label: 'Primary Success Metric',
        type: 'text',
        placeholder: 'e.g., button clicks',
        required: false,
      },
      {
        id: 'secondaryMetrics',
        label: 'Second-order metrics (comma separated)',
        type: 'text',
        placeholder: 'e.g., activations, registrations',
        required: false,
      }
    ],
  },
  {
    id: 'variants',
    title: 'Variants',
    description: 'Describe your control and variant',
    fields: [
      {
        id: 'control',
        label: 'Control Description',
        type: 'textarea',
        placeholder: 'Describe the current version...',
        required: false,
      },
      {
        id: 'controlImage',
        label: 'Control Variant Image',
        type: 'file',
        placeholder: 'Upload an image of your control variant',
        required: false,
      },
      {
        id: 'variantA',
        label: 'Variant A Description',
        type: 'textarea',
        placeholder: 'Describe the test variant...',
        required: false,
      },
      {
        id: 'variantAImage',
        label: 'Test Variant Image',
        type: 'file', 
        placeholder: 'Upload an image of your test variant',
        required: false,
      }
    ],
  }
];