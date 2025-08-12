import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'status-badge';
  const variantClasses = `status-badge--${variant}`;
  const sizeClasses = `status-badge--${size}`;

  const badgeClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} {...props}>
      {icon && <span className="status-badge__icon">{icon}</span>}
      <span className="status-badge__text">{children}</span>
    </span>
  );
};

export default StatusBadge;