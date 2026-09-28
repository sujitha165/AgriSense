import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-darkbg-card border border-stone-200/80 dark:border-darkbg-border rounded-2xl shadow-sm ${
        padded ? 'p-6' : ''
      } ${hover ? 'hover:shadow-md hover:border-agri-500/30 transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
