import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyMap from '@/components/organisms/PropertyMap';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { propertyService } from '@/services';
import Button from '@/components/atoms/Button';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    propertyTypes: [],
    bedroomsMin: 0,
    location: '',
    sortBy: 'newest'
  });

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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <SkeletonLoader count={1} type="card" />
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
            onRetry={loadProperties}
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
      className="h-full flex overflow-hidden"
    >
      {/* Filter Sidebar */}
      <FilterSidebar
        onFiltersChange={handleFiltersChange}
        isOpen={mobileFiltersOpen}
        onToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Filter Button */}
        <div className="md:hidden p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setMobileFiltersOpen(true)}
              icon="Filter"
              variant="outline"
            >
              Filters
            </Button>
            <div className="text-sm text-gray-600">
              {properties.length} properties found
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
          />
          
          {/* Results Counter - Desktop */}
          <div className="hidden md:block absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-900">
              {properties.length} Properties Found
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapView;