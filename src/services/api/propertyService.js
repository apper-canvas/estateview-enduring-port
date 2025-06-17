import propertyData from '../mockData/property.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.data = [...propertyData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const property = this.data.find(item => item.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async getFavorites() {
    await delay(200);
    return this.data.filter(property => property.isFavorite).map(item => ({ ...item }));
  }

  async toggleFavorite(id) {
    await delay(200);
    const property = this.data.find(item => item.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    property.isFavorite = !property.isFavorite;
    return { ...property };
  }

  async search(filters = {}) {
    await delay(400);
    let results = [...this.data];

    // Price filter
    if (filters.priceMin) {
      results = results.filter(property => property.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      results = results.filter(property => property.price <= filters.priceMax);
    }

    // Property type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    // Bedrooms filter
    if (filters.bedroomsMin) {
      results = results.filter(property => property.bedrooms >= filters.bedroomsMin);
    }

    // Location filter
    if (filters.location) {
      results = results.filter(property => 
        property.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'bedrooms':
          results.sort((a, b) => b.bedrooms - a.bedrooms);
          break;
        case 'newest':
          results.sort((a, b) => b.yearBuilt - a.yearBuilt);
          break;
        default:
          break;
      }
    }

    return results;
  }

  async create(property) {
    await delay(300);
    const maxId = Math.max(...this.data.map(item => item.Id));
    const newProperty = { 
      ...property, 
      Id: maxId + 1,
      isFavorite: false 
    };
    this.data.push(newProperty);
    return { ...newProperty };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new PropertyService();