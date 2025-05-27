import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.min(100, Math.round((currentStep / (totalSteps - 1)) * 100));

  return (
    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;