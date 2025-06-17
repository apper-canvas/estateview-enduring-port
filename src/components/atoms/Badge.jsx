import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
    gray: 'bg-gray-100 text-gray-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;