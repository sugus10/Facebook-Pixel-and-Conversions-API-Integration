import React from 'react';
import './Select.css';

const Select = ({ 
  label,
  error,
  helper,
  children,
  className = '',
  size = 'md',
  variant = 'default',
  placeholder = 'Select an option...',
  ...props 
}) => {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'select';
  const sizeClasses = `select--${size}`;
  const variantClasses = `select--${variant}`;
  const errorClasses = error ? 'select--error' : '';

  const selectClasses = [
    baseClasses,
    sizeClasses,
    variantClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="select-group">
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {children}
        </select>
        <div className="select-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && (
        <div className="select-error">
          {error}
        </div>
      )}
      {helper && !error && (
        <div className="select-helper">
          {helper}
        </div>
      )}
    </div>
  );
};

export default Select;