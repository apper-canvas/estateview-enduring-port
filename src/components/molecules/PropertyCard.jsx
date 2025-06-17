import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { propertyService } from '@/services';

const PropertyCard = ({ property, onFavoriteToggle }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      await propertyService.toggleFavorite(property.Id);
      if (onFavoriteToggle) {
        onFavoriteToggle(property.Id);
      }
      toast.success(property.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="property-card bg-white rounded-lg shadow-card overflow-hidden cursor-pointer group max-w-full"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="property-image w-full h-full object-cover max-w-full"
        />
        
        {/* Price Tag */}
        <div className="absolute top-4 left-4">
          <Badge variant="accent" className="price-tag font-bold">
            {formatPrice(property.price)}
          </Badge>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all duration-200 ${
            property.isFavorite 
              ? 'bg-error text-white' 
              : 'bg-white text-gray-400 hover:text-error'
          }`}
        >
          <ApperIcon 
            name={property.isFavorite ? 'Heart' : 'Heart'} 
            size={18}
            fill={property.isFavorite ? 'currentColor' : 'none'}
          />
        </motion.button>

        {/* Property Type Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge variant="gray" size="sm">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 break-words">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 break-words">
          {property.address}
        </p>

        {/* Property Stats */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" size={16} className="mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" size={16} className="mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center text-xs">
            <ApperIcon name="Square" size={14} className="mr-1" />
            <span>{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Year Built */}
        <div className="mt-3 text-xs text-gray-400">
          Built in {property.yearBuilt}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;