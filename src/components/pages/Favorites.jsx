import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '@/components/molecules/PropertyCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { propertyService } from '@/services';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getFavorites();
      setFavorites(result);
    } catch (err) {
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (propertyId) => {
    try {
      await propertyService.toggleFavorite(propertyId);
      // Remove from favorites list
      setFavorites(prev => prev.filter(property => property.Id !== propertyId));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <SkeletonLoader count={6} type="property-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <ErrorState 
            message={error}
            onRetry={loadFavorites}
          />
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <EmptyState 
            title="No favorite properties yet"
            description="Start browsing properties and save your favorites to see them here"
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/browse'}
            icon="Heart"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6 bg-background"
    >
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-2">
              {favorites.length} favorite propert{favorites.length !== 1 ? 'ies' : 'y'} saved
            </p>
          </div>
        </div>

        {/* Favorites Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {favorites.map((property, index) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <PropertyCard 
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Favorites;