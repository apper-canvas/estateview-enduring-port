import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the content.",
  onRetry,
  icon = "AlertCircle"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name={icon} size={32} className="text-error" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 break-words">{message}</p>
        
        {onRetry && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onRetry} icon="RefreshCw">
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ErrorState;