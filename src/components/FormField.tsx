import React from 'react';

interface FormFieldProps {
  field: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'file';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  };
  value: string;
  isEnhanced: boolean;
  isBeingEnhanced: boolean;
  isLoading: boolean;
  onChange: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  onEnhance?: () => void;
  showEnhanceButton?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  isEnhanced,
  isBeingEnhanced,
  isLoading,
  onChange,
  onFileChange,
  onEnhance,
  showEnhanceButton = true,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {isEnhanced && (
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">AI Enhanced</span>
        )}
      </label>
      
      <div className={`${isEnhanced ? 'border-blue-300 ring-1 ring-blue-300' : ''}`}>
        {field.type === 'file' ? (
          <input
            type="file"
            id={field.id}
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0 && onFileChange) {
                onFileChange(files[0]);
              }
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEnhanced ? 'bg-blue-50' : ''
            }`}
            rows={4}
            required={field.required}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEnhanced ? 'bg-blue-50' : ''
            }`}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEnhanced ? 'bg-blue-50' : ''
            }`}
            required={field.required}
          />
        )}
      </div>

      {showEnhanceButton && field.type !== 'file' && onEnhance && (
        <button
          onClick={onEnhance}
          className="mt-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          disabled={isLoading}
        >
          {isLoading && isBeingEnhanced ? (
            <>
              <div className="animate-spin mr-1 h-3 w-3 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
              Enhancing with AI...
            </>
          ) : (
            "Enhance with AI"
          )}
        </button>
      )}
    </div>
  );
};

export default FormField;