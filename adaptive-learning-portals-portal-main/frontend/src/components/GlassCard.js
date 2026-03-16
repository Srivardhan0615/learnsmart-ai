import React from 'react';
import { cn } from '@/lib/utils';

const GlassCard = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
