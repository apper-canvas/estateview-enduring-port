import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import FilterSidebar from '@/components/molecules/FilterSidebar';

const Browse = () => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    propertyTypes: [],
    bedroomsMin: 0,
    location: '',
    sortBy: 'newest'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false);
    toast.success('Filters applied successfully');
  };

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
          <Button
            onClick={() => setMobileFiltersOpen(true)}
            icon="Filter"
            variant="outline"
            className="w-full"
          >
            Filters
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="container mx-auto max-w-7xl">
            <PropertyGrid 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Browse;