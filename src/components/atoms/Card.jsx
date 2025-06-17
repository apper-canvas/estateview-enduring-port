import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  hover = false, 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-white rounded-lg shadow-card transition-all duration-200 ${paddings[padding]} ${className}`;
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' } : {}}
      className={`${baseClasses} ${hoverClasses}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;