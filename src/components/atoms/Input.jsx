import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.toString().length > 0;
  const shouldFloat = focused || hasValue;

  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 
    ${error ? 'border-error' : focused ? 'border-primary' : 'border-gray-300'}
    ${error ? 'focus:border-error' : 'focus:border-primary'}
    focus:outline-none bg-white
    ${icon ? 'pl-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {/* Icon */}
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon 
            name={icon} 
            size={18} 
            className={`transition-colors duration-200 ${
              focused ? 'text-primary' : 'text-gray-400'
            }`}
          />
        </div>
      )}

      {/* Input */}
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputClasses}
        placeholder={!label ? placeholder : ''}
        required={required}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: shouldFloat ? '0px' : '50%',
            fontSize: shouldFloat ? '0.875rem' : '1rem',
            y: shouldFloat ? 0 : '-50%',
            x: shouldFloat ? 12 : icon ? 48 : 16,
            color: error ? '#E74C3C' : focused ? '#2C5530' : '#6B7280'
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute pointer-events-none bg-white px-2 font-medium origin-left"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}

      {/* Password Toggle */}
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
        >
          <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;