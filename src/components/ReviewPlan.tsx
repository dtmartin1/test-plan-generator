import React from 'react';
import { ArrowLeft, FileText, Upload } from 'lucide-react';
import { TestPlan } from '../types';

interface ReviewPlanProps {
  testPlan: TestPlan;
  isEnhanced: boolean;
  error: string;
  onPrevious: () => void;
  onExportPDF: () => void;
  onExportSlides: () => void;
}

const ReviewPlan: React.FC<ReviewPlanProps> = ({
  testPlan,
  isEnhanced,
  error,
  onPrevious,
  onExportPDF,
  onExportSlides,
}) => {
  // Format sample size for display
  const formatSampleSize = (value: string) => {
    // If it's a number without commas, add commas
    if (/^\d+$/.test(value)) {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Review Your Test Plan</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-md">
          <h3 className="font-semibold mb-2 text-red-700">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className={`space-y-6 mb-8 ${isEnhanced ? 'bg-blue-50 p-4 rounded-lg border border-blue-200' : ''}`}>
        {isEnhanced && (
          <div className="bg-blue-100 p-3 rounded-md mb-4 text-blue-800">
            <p className="font-semibold">This test plan has been completely rewritten by AI in the style of Ron Kohavi, a world-renowned expert in A/B testing.</p>
          </div>
        )}
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Context</h3>
          <p className="whitespace-pre-line bg-gray-50 p-3 rounded-md">{testPlan.context}</p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Hypothesis</h3>
          <p className="whitespace-pre-line bg-gray-50 p-3 rounded-md">{testPlan.hypothesis}</p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Expected Impact</h3>
          <p className="bg-gray-50 p-3 rounded-md">{testPlan.expectedImpact}</p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Experiment Setup and Parameters</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium">Sample Size per Variant:</p>
              <p>{formatSampleSize(testPlan.experimentSetup.sampleSize)}</p>
            </div>
            <div>
              <p className="font-medium">Expected Duration:</p>
              <p>{testPlan.experimentSetup.duration}</p>
            </div>
            <div>
              <p className="font-medium">Statistical Significance:</p>
              <p>{testPlan.experimentSetup.significance}</p>
            </div>
            <div>
              <p className="font-medium">Statistical Power:</p>
              <p>{testPlan.experimentSetup.power}</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Success Metrics</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">Primary Success Metric:</p>
            <p className="mb-2">{testPlan.metrics.primary}</p>
            
            <p className="font-medium">Second-order metrics:</p>
            <ul className="list-disc list-inside mb-2">
              {testPlan.metrics.secondaryMetrics.map((metric, index) => (
                <li key={index}>{metric}</li>
              ))}
            </ul>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Variants</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium">Control</h4>
              <p className="whitespace-pre-line">{testPlan.variants.control}</p>
              {testPlan.variants.controlImage && (
                <div className="mt-2">
                  <p className="font-medium">Control Variant Image:</p>
                  <img 
                    src={testPlan.variants.controlImage} 
                    alt="Control Variant" 
                    className="mt-2 max-w-full h-auto rounded border border-gray-300"
                  />
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium">Variant A</h4>
              <p className="whitespace-pre-line">{testPlan.variants.variantA}</p>
              {testPlan.variants.variantAImage && (
                <div className="mt-2">
                  <p className="font-medium">Test Variant Image:</p>
                  <img 
                    src={testPlan.variants.variantAImage} 
                    alt="Test Variant" 
                    className="mt-2 max-w-full h-auto rounded border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Edit
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={onExportPDF}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FileText size={16} className="mr-2" />
            Export as PDF
          </button>
          
          <button
            onClick={onExportSlides}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Upload size={16} className="mr-2" />
            Export as Slides
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPlan;