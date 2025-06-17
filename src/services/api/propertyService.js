import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.tableName = 'property';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "year_built" } },
          { field: { Name: "is_favorite" } }
        ],
        orderBy: [
          { fieldName: "year_built", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(item => this.transformFromDatabase(item));
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "year_built" } },
          { field: { Name: "is_favorite" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Property not found');
      }

      return this.transformFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }

  async search(filters = {}) {
    await delay(400);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "year_built" } },
          { field: { Name: "is_favorite" } }
        ],
        where: [],
        orderBy: []
      };

      // Add price filters
      if (filters.priceMin && filters.priceMin > 0) {
        params.where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin.toString()]
        });
      }

      if (filters.priceMax && filters.priceMax < 2000000) {
        params.where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax.toString()]
        });
      }

      // Add property type filter
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        params.where.push({
          FieldName: "property_type",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        });
      }

      // Add bedrooms filter
      if (filters.bedroomsMin && filters.bedroomsMin > 0) {
        params.where.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin.toString()]
        });
      }

      // Add location filter
      if (filters.location && filters.location.trim()) {
        params.where.push({
          FieldName: "address",
          Operator: "Contains",
          Values: [filters.location.trim()]
        });
      }

      // Add sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            params.orderBy.push({ fieldName: "price", sorttype: "ASC" });
            break;
          case 'price-high':
            params.orderBy.push({ fieldName: "price", sorttype: "DESC" });
            break;
          case 'bedrooms':
            params.orderBy.push({ fieldName: "bedrooms", sorttype: "DESC" });
            break;
          case 'newest':
            params.orderBy.push({ fieldName: "year_built", sorttype: "DESC" });
            break;
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => this.transformFromDatabase(item));
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }

  async toggleFavorite(id) {
    await delay(200);
    try {
      // First get current property state
      const currentProperty = await this.getById(id);
      const newFavoriteState = !currentProperty.isFavorite;

      const params = {
        records: [{
          Id: parseInt(id, 10),
          is_favorite: newFavoriteState ? "true" : "false"
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update favorite status:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update favorite status');
        }
      }

      return { ...currentProperty, isFavorite: newFavoriteState };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  async create(property) {
    await delay(300);
    try {
      const params = {
        records: [{
          title: property.title,
          price: property.price,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          square_feet: property.squareFeet,
          property_type: property.propertyType,
          images: Array.isArray(property.images) ? property.images.join('\n') : property.images,
          description: property.description,
          features: Array.isArray(property.features) ? property.features.join('\n') : property.features,
          coordinates: typeof property.coordinates === 'object' ? JSON.stringify(property.coordinates) : property.coordinates,
          year_built: property.yearBuilt,
          is_favorite: "false"
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create property');
        }
        
        if (successfulRecords.length > 0) {
          return this.transformFromDatabase(successfulRecords[0].data);
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete record:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete property');
        }
      }

      return { Id: parseInt(id, 10) };
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  async getFavorites() {
    await delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "year_built" } },
          { field: { Name: "is_favorite" } }
        ],
        where: [{
          FieldName: "is_favorite",
          Operator: "ExactMatch",
          Values: ["true"]
        }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => this.transformFromDatabase(item));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }

  transformFromDatabase(dbItem) {
    return {
      Id: dbItem.Id,
      title: dbItem.title || '',
      price: parseInt(dbItem.price) || 0,
      address: dbItem.address || '',
      bedrooms: parseInt(dbItem.bedrooms) || 0,
      bathrooms: parseInt(dbItem.bathrooms) || 0,
      squareFeet: parseInt(dbItem.square_feet) || 0,
      propertyType: dbItem.property_type || '',
      images: dbItem.images ? dbItem.images.split('\n').filter(img => img.trim()) : [],
      description: dbItem.description || '',
      features: dbItem.features ? dbItem.features.split('\n').filter(feat => feat.trim()) : [],
      coordinates: dbItem.coordinates ? JSON.parse(dbItem.coordinates) : { lat: 0, lng: 0 },
      yearBuilt: parseInt(dbItem.year_built) || new Date().getFullYear(),
      isFavorite: dbItem.is_favorite === "true" || dbItem.is_favorite === true
    };
  }
}

export default new PropertyService();