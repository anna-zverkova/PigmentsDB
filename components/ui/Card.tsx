import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`rounded-xl border border-tint-ink/10 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};
