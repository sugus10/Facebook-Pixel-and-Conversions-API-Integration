import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn--${variant}`;
  const sizeClasses = `btn--${size}`;
  const disabledClasses = disabled || loading ? 'btn--disabled' : '';
  const loadingClasses = loading ? 'btn--loading' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="btn__spinner">
          <div className="spinner"></div>
        </div>
      )}
      {icon && !loading && (
        <span className="btn__icon">{icon}</span>
      )}
      <span className={loading ? 'btn__text--hidden' : 'btn__text'}>
        {children}
      </span>
    </button>
  );
};

export default Button;