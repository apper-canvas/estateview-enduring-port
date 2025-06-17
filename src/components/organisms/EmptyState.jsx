import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "No items found",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 break-words">{description}</p>
        
        {actionLabel && onAction && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={onAction}>
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;