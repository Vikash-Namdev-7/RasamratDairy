import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'gold': return 'btn-gold';
      case 'wine': return 'btn-wine';
      case 'outline': return 'btn-outline';
      case 'outline-light': return 'btn-outline-light';
      default: return 'btn-primary';
    }
  };

  return (
    <button type="button" className={`btn ${getVariantClass()} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
