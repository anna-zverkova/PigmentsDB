import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-tint-ink text-tint-paper hover:bg-tint-ink/90',
    secondary: 'bg-tint-clay text-tint-ink hover:bg-tint-clay/80',
    outline: 'border border-tint-ink/20 hover:bg-tint-ink/5 text-tint-ink',
    ghost: 'hover:bg-tint-ink/5 text-tint-ink',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 py-2 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
