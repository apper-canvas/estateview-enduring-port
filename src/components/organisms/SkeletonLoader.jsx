import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const renderPropertyCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
      <div className="p-6 space-y-4">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-card space-y-4">
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-card flex items-center space-x-4">
      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );

  const getSkeletonComponent = () => {
    switch (type) {
      case 'property-card':
        return renderPropertyCardSkeleton();
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  const getGridClasses = () => {
    switch (type) {
      case 'property-card':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6';
      case 'list':
        return 'space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={getGridClasses()}
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {getSkeletonComponent()}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;