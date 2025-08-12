import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'card';
  const variantClasses = `card--${variant}`;
  const paddingClasses = `card--padding-${padding}`;
  const hoverClasses = hover ? 'card--hover' : '';

  const cardClasses = [
    baseClasses,
    variantClasses,
    paddingClasses,
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`card__header ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;