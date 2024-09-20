import React, { forwardRef } from 'react';


export const Input = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    const inputClasses = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
      error ? 'border-red-300' : 'border-gray-300'
    } ${className}`;

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';