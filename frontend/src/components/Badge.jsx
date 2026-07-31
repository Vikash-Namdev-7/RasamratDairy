import React from 'react';

export const Badge = ({ children, variant = 'gold', className = '', ...props }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'wine': return 'badge-wine';
      case 'out-of-stock': return 'badge-out-of-stock';
      default: return 'badge-gold';
    }
  };

  return (
    <span className={`${getBadgeClass()} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
