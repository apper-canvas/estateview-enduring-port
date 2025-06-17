import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/molecules/PropertyCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { propertyService } from '@/services';

const PropertyGrid = ({ filters, onFiltersChange }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.search(filters);
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (propertyId) => {
    try {
      const updatedProperty = await propertyService.toggleFavorite(propertyId);
      setProperties(prev => 
        prev.map(property => 
          property.Id === propertyId 
            ? { ...property, isFavorite: updatedProperty.isFavorite }
            : property
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return <SkeletonLoader count={6} type="property-card" />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadProperties}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState 
        title="No properties found"
        description="Try adjusting your filters or search criteria to find more properties"
        actionLabel="Clear Filters"
        onAction={() => onFiltersChange && onFiltersChange({
          priceMin: 0,
          priceMax: 2000000,
          propertyTypes: [],
          bedroomsMin: 0,
          location: '',
          sortBy: 'newest'
        })}
        icon="Home"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-gray-900">
          {properties.length} Properties Found
        </h2>
      </div>

      {/* Property Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {properties.map((property, index) => (
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
  );
};

export default PropertyGrid;