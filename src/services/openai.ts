import { TestPlan } from '../types';
import OpenAI from 'openai';

// Helper function to validate the API key
const validateApiKey = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return apiKey && apiKey !== 'your_openai_api_key_here';
};

// Get OpenAI client instance (lazy initialization)
const getOpenAIClient = (): OpenAI => {
  // Validate API key before creating client
  if (!validateApiKey()) {
    throw new Error('Please provide a valid OpenAI API key in your .env file');
  }
  
  return new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
};

// Create system message for test plan enhancement
const createTestPlanSystemPrompt = (): string => {
  return `You are Ron Kohavi, expert in A/B testing and experimentation. 
  
Your task is to enhance a test plan by improving clarity and professionalism while preserving the original meaning.

Keep your enhancements concise and focused:
1. Maintain the core information from the original text
2. Do not add fictional details or invent new information
3. Keep your enhancements approximately the same length as the original
4. Focus on improving clarity, structure, and technical accuracy

Respond with ONLY the enhanced test plan content, maintaining all sections but improving them with your expertise.`;
};

// Create system message for field enhancement
const createFieldEnhancementSystemPrompt = (field: string): string => {
  let basePrompt = `You are Ron Kohavi, expert in A/B testing and experimentation.`;
  let taskDescription = '';
  
  switch (field) {
    case 'context':
      taskDescription = 'Improve the clarity and professionalism of this test context. Keep it concise and focused on the business problem and testing rationale.';
      break;
    case 'hypothesis':
      taskDescription = 'Format this hypothesis clearly as "If we [action], then [expected result] because [reasoning]." Keep it concise and falsifiable.';
      break;
    case 'expectedImpact':
      taskDescription = 'Refine this impact statement to be clear and quantitative where possible. Keep it brief but precise.';
      break;
    case 'primary':
      taskDescription = 'Clarify this primary metric definition, focusing on how it\'s measured and why it\'s appropriate. Be concise.';
      break;
    case 'secondaryMetrics':
      taskDescription = 'Refine these secondary metrics to ensure they complement the primary metric. Keep the list focused and comma-separated.';
      break;
    case 'control':
      taskDescription = 'Improve this control variant description, focusing on clarity. Keep it concise and factual.';
      break;
    case 'variantA':
      taskDescription = 'Enhance this test variant description, highlighting what differs from control. Keep it concise and focused on the changes.';
      break;
    default:
      taskDescription = 'Improve this content to be more clear and professional. Keep it concise.';
  }
  
  return `${basePrompt}

Your task is to enhance the following ${field} text to make it more professional and clear.

Important guidelines:
1. DO NOT add fictional details or invent information
2. Keep your enhancement approximately the same length as the original
3. Preserve all the original meaning and facts
4. ${taskDescription}

Respond with ONLY the enhanced content.`;
};

// Helper function to format test plan for API submission
const formatTestPlanForSubmission = (testPlan: TestPlan): string => {
  return `
# Test Plan

## Context
${testPlan.context}

## Hypothesis
${testPlan.hypothesis}

## Expected Impact
${testPlan.expectedImpact}

## Experiment Setup
- Sample Size per Variant: ${testPlan.experimentSetup.sampleSize}
- Expected Duration: ${testPlan.experimentSetup.duration}
- Statistical Significance: ${testPlan.experimentSetup.significance}
- Statistical Power: ${testPlan.experimentSetup.power}

## Success Metrics
- Primary Success Metric: ${testPlan.metrics.primary}
- Secondary Metrics: ${testPlan.metrics.secondaryMetrics.join(', ')}

## Variants
### Control
${testPlan.variants.control}

### Variant A
${testPlan.variants.variantA}
`;
};

// Helper function to parse enhanced test plan response
const parseEnhancedTestPlan = (enhancedText: string, originalPlan: TestPlan): TestPlan => {
  const newPlan = { ...originalPlan };
  
  // Try to extract context
  const contextMatch = enhancedText.match(/#+\s*Context\s*\n+([\s\S]*?)(?=#+\s*)/i);
  if (contextMatch && contextMatch[1].trim()) {
    newPlan.context = contextMatch[1].trim();
  }
  
  // Try to extract hypothesis
  const hypothesisMatch = enhancedText.match(/#+\s*Hypothesis\s*\n+([\s\S]*?)(?=#+\s*)/i);
  if (hypothesisMatch && hypothesisMatch[1].trim()) {
    newPlan.hypothesis = hypothesisMatch[1].trim();
  }
  
  // Try to extract expected impact
  const impactMatch = enhancedText.match(/#+\s*Expected Impact\s*\n+([\s\S]*?)(?=#+\s*)/i);
  if (impactMatch && impactMatch[1].trim()) {
    newPlan.expectedImpact = impactMatch[1].trim();
  }
  
  // Try to extract variants - control
  const controlMatch = enhancedText.match(/#+\s*Control\s*\n+([\s\S]*?)(?=#+\s*(?:Variant|$))/i);
  if (controlMatch && controlMatch[1].trim()) {
    newPlan.variants.control = controlMatch[1].trim();
  }
  
  // Try to extract variants - variant A
  const variantAMatch = enhancedText.match(/#+\s*Variant A\s*\n+([\s\S]*?)(?=#+\s*|$)/i);
  if (variantAMatch && variantAMatch[1].trim()) {
    newPlan.variants.variantA = variantAMatch[1].trim();
  }
  
  // Try to extract primary success metric
  const primaryMetricMatch = enhancedText.match(/Primary Success Metric:?\s*([^\n]+)/i);
  if (primaryMetricMatch && primaryMetricMatch[1].trim()) {
    newPlan.metrics.primary = primaryMetricMatch[1].trim();
  }
  
  // Try to extract secondary metrics
  const secondaryMetricsMatch = enhancedText.match(/Secondary Metrics:?\s*([^\n]+)/i);
  if (secondaryMetricsMatch && secondaryMetricsMatch[1].trim()) {
    newPlan.metrics.secondaryMetrics = secondaryMetricsMatch[1].split(',').map(m => m.trim());
  }
  
  return newPlan;
};

// Export the service
export const openaiService = {
  async enhanceTestPlan(testPlan: TestPlan): Promise<TestPlan> {
    console.log('Enhancing test plan with OpenAI...');
    
    try {
      // Get the OpenAI client
      const openai = getOpenAIClient();
      
      // Format the test plan for submission
      const formattedTestPlan = formatTestPlanForSubmission(testPlan);
      
      // Create the system prompt
      const systemPrompt = createTestPlanSystemPrompt();
      
      // Call the OpenAI API to enhance the test plan
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // Reverted back to "gpt-4-turbo-preview"
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: formattedTestPlan }
        ],
        temperature: 0.5, // Lower temperature for more focused outputs
        max_tokens: 1000, // Limit token count for more concise responses
      });
      
      // Extract the response
      const enhancedContent = completion.choices[0].message.content;
      
      if (!enhancedContent) {
        throw new Error('Failed to generate enhanced content from OpenAI');
      }
      
      // Parse the enhanced test plan
      const enhancedPlan = parseEnhancedTestPlan(enhancedContent, testPlan);
      
      return enhancedPlan;
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to enhance test plan: ${error.message}`);
      } else {
        throw new Error('Failed to enhance test plan: Unknown error');
      }
    }
  },
  
  async generateSuggestions(field: string, currentValue: string): Promise<string> {
    console.log(`Generating suggestions for field: ${field} with OpenAI...`);
    
    try {
      // Get the OpenAI client
      const openai = getOpenAIClient();
      
      // Create the system prompt for field enhancement
      const systemPrompt = createFieldEnhancementSystemPrompt(field);
      
      // Call the OpenAI API to generate suggestions
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // Reverted back to "gpt-4-turbo-preview"
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: currentValue }
        ],
        temperature: 0.4, // Lower temperature for more consistent, focused responses
        max_tokens: 250, // Limit token count to keep responses concise
      });
      
      // Extract the response
      const enhancedContent = completion.choices[0].message.content;
      
      if (!enhancedContent) {
        throw new Error('Failed to generate suggestions from OpenAI');
      }
      
      return enhancedContent;
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate suggestions: ${error.message}`);
      } else {
        throw new Error('Failed to generate suggestions: Unknown error');
      }
    }
  }
};