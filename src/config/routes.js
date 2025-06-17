import Browse from '@/components/pages/Browse';
import PropertyDetail from '@/components/pages/PropertyDetail';
import MapView from '@/components/pages/MapView';
import Favorites from '@/components/pages/Favorites';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse Properties',
    path: '/browse',
    icon: 'Home',
    component: Browse
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  favorites: {
    id: 'favorites',
    label: 'My Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  propertyDetail: {
    id: 'propertyDetail',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;