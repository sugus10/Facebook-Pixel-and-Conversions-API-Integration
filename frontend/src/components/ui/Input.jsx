import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  error,
  helper,
  icon,
  className = '',
  size = 'md',
  variant = 'default',
  ...props 
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'input';
  const sizeClasses = `input--${size}`;
  const variantClasses = `input--${variant}`;
  const errorClasses = error ? 'input--error' : '';
  const iconClasses = icon ? 'input--with-icon' : '';

  const inputClasses = [
    baseClasses,
    sizeClasses,
    variantClasses,
    errorClasses,
    iconClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <div className="input-error">
          {error}
        </div>
      )}
      {helper && !error && (
        <div className="input-helper">
          {helper}
        </div>
      )}
    </div>
  );
};

export default Input;