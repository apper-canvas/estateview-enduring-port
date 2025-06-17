import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { filterService } from "@/services";

const FilterSidebar = ({ onFiltersChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    propertyTypes: [],
    bedroomsMin: 0,
    location: '',
    sortBy: 'newest'
  });
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [defaultFilters, range, types] = await Promise.all([
          filterService.getDefault(),
          filterService.getPriceRange(),
          filterService.getPropertyTypes()
        ]);
        
        setFilters(defaultFilters);
        setPriceRange(range);
        setPropertyTypes(types);
      } catch (error) {
        console.error('Failed to load filter data:', error);
      }
    };

    loadFilterData();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handlePropertyTypeToggle = (type) => {
    const updatedTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    
    handleFilterChange('propertyTypes', updatedTypes);
  };

const clearFilters = () => {
    const clearedFilters = {
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      propertyTypes: [],
      bedroomsMin: 0,
      location: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500"
            >
              Clear All
            </Button>
            <button
              onClick={onToggle}
              className="md:hidden p-1 rounded-lg text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Min Price: {formatPrice(filters.priceMin)}
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={10000}
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Max Price: {formatPrice(filters.priceMax)}
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={10000}
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Property Type</h3>
          <div className="space-y-2">
            {propertyTypes.map(type => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes.includes(type)}
                  onChange={() => handlePropertyTypeToggle(type)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Minimum Bedrooms</h3>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => handleFilterChange('bedroomsMin', num)}
                className={`p-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  filters.bedroomsMin === num
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                {num === 0 ? 'Any' : `${num}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="bedrooms">Most Bedrooms</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 flex-shrink-0 border-r border-gray-200 bg-white">
        {sidebarContent}
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;