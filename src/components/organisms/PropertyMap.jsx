import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ properties, selectedProperty, onPropertySelect }) => {
  const navigate = useNavigate();
  const mapRef = useRef();

  // Default center (Los Angeles area)
  const defaultCenter = [34.0522, -118.2437];
  const defaultZoom = 11;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.Id}`);
  };

  // Create custom marker icon
  const createCustomIcon = (price) => {
    return L.divIcon({
      html: `<div class="property-marker">${formatPrice(price)}</div>`,
      className: 'custom-div-icon',
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map((property) => (
          <Marker
            key={property.Id}
            position={[property.coordinates.lat, property.coordinates.lng]}
            icon={createCustomIcon(property.price)}
            eventHandlers={{
              click: () => {
                if (onPropertySelect) {
                  onPropertySelect(property);
                }
              }
            }}
          >
            <Popup className="property-popup">
              <div className="p-2 max-w-xs">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-sm text-gray-900 break-words">
                    {property.title}
                  </h3>
                  <p className="text-xs text-gray-600 break-words">
                    {property.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm">
                      {formatPrice(property.price)}
                    </Badge>
                    <Badge variant="gray" size="sm">
                      {property.propertyType}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <ApperIcon name="Bed" size={14} className="mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Bath" size={14} className="mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Square" size={14} className="mr-1" />
                      <span>{property.squareFeet.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePropertyClick(property)}
                    className="w-full mt-3 px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;