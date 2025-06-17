import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ImageGallery from '@/components/molecules/ImageGallery';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { propertyService } from '@/services';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getById(id);
      setProperty(result);
    } catch (err) {
      setError(err.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const updatedProperty = await propertyService.toggleFavorite(property.Id);
      setProperty(prev => ({ ...prev, isFavorite: updatedProperty.isFavorite }));
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

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <SkeletonLoader count={1} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <ErrorState 
            message={error}
            onRetry={loadProperty}
          />
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6 bg-background"
    >
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          icon="ArrowLeft"
          variant="ghost"
          className="mb-4"
        >
          Back to Properties
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4 break-words">
              {property.title}
            </h1>
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <ApperIcon name="MapPin" size={20} />
              <span className="break-words">{property.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="accent" size="lg" className="text-xl font-bold">
                {formatPrice(property.price)}
              </Badge>
              <Badge variant="gray">{property.propertyType}</Badge>
              <Badge variant="secondary">Built in {property.yearBuilt}</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleFavoriteToggle}
              variant={property.isFavorite ? "danger" : "outline"}
              icon="Heart"
              className="flex-shrink-0"
            >
              {property.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <ImageGallery images={property.images} title={property.title} />
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-2xl font-display font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed break-words">
                {property.description}
              </p>
            </Card>

            {/* Features */}
            <Card>
              <h2 className="text-2xl font-display font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <ApperIcon name="Check" size={16} className="text-success flex-shrink-0" />
                    <span className="text-gray-700 break-words">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Stats */}
            <Card>
              <h3 className="text-xl font-display font-semibold mb-6">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Bed" size={20} className="text-primary" />
                    <span className="font-medium">Bedrooms</span>
                  </div>
                  <span className="text-lg font-semibold">{property.bedrooms}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Bath" size={20} className="text-primary" />
                    <span className="font-medium">Bathrooms</span>
                  </div>
                  <span className="text-lg font-semibold">{property.bathrooms}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Square" size={20} className="text-primary" />
                    <span className="font-medium">Square Feet</span>
                  </div>
                  <span className="text-lg font-semibold">{property.squareFeet.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Calendar" size={20} className="text-primary" />
                    <span className="font-medium">Year Built</span>
                  </div>
                  <span className="text-lg font-semibold">{property.yearBuilt}</span>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card>
              <h3 className="text-xl font-display font-semibold mb-4">Interested in this property?</h3>
              <div className="space-y-3">
                <Button className="w-full" icon="Phone">
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full" icon="Mail">
                  Send Message
                </Button>
                <Button variant="ghost" className="w-full" icon="Calendar">
                  Schedule Tour
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;