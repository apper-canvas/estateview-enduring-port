import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18} className="ml-2" />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;