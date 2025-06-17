import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.tableName = 'filter';
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

  async getDefault() {
    await delay(100);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price_min" } },
          { field: { Name: "price_max" } },
          { field: { Name: "property_types" } },
          { field: { Name: "bedrooms_min" } },
          { field: { Name: "location" } },
          { field: { Name: "sort_by" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        // Return default filter if none exists
        return {
          priceMin: 0,
          priceMax: 2000000,
          propertyTypes: [],
          bedroomsMin: 0,
          location: '',
          sortBy: 'newest'
        };
      }

      return this.transformFromDatabase(response.data[0]);
    } catch (error) {
      console.error("Error fetching default filter:", error);
      // Return default filter on error
      return {
        priceMin: 0,
        priceMax: 2000000,
        propertyTypes: [],
        bedroomsMin: 0,
        location: '',
        sortBy: 'newest'
      };
    }
  }

  async save(filter) {
    await delay(200);
    try {
      // Check if filter record exists
      const existing = await this.getDefault();
      
      const filterData = {
        price_min: filter.priceMin,
        price_max: filter.priceMax,
        property_types: filter.propertyTypes.join(','),
        bedrooms_min: filter.bedroomsMin,
        location: filter.location,
        sort_by: filter.sortBy
      };

      let response;
      if (existing.Id) {
        // Update existing filter
        const params = {
          records: [{
            Id: existing.Id,
            ...filterData
          }]
        };
        response = await this.apperClient.updateRecord(this.tableName, params);
      } else {
        // Create new filter
        const params = {
          records: [filterData]
        };
        response = await this.apperClient.createRecord(this.tableName, params);
      }

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return filter;
    } catch (error) {
      console.error("Error saving filter:", error);
      throw error;
    }
  }

  async getPriceRange() {
    await delay(100);
    try {
      const params = {
        fields: [
          { field: { Name: "price" }, Function: "Minimum", Alias: "MinPrice" },
          { field: { Name: "price" }, Function: "Maximum", Alias: "MaxPrice" }
        ]
      };

      const response = await this.apperClient.fetchRecords('property', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return { min: 100000, max: 2000000 };
      }

      const result = response.data[0];
      return {
        min: parseInt(result.MinPrice) || 100000,
        max: parseInt(result.MaxPrice) || 2000000
      };
    } catch (error) {
      console.error("Error fetching price range:", error);
      return { min: 100000, max: 2000000 };
    }
  }

  async getPropertyTypes() {
    await delay(100);
    try {
      const params = {
        fields: [
          { field: { Name: "property_type" } }
        ],
        groupBy: ["property_type"]
      };

      const response = await this.apperClient.fetchRecords('property', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa'];
      }

      const types = response.data
        .map(item => item.property_type)
        .filter(type => type && type.trim())
        .sort();

      return types.length > 0 ? types : ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa'];
    } catch (error) {
      console.error("Error fetching property types:", error);
      return ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa'];
    }
  }

  transformFromDatabase(dbItem) {
    return {
      Id: dbItem.Id,
      priceMin: parseInt(dbItem.price_min) || 0,
      priceMax: parseInt(dbItem.price_max) || 2000000,
      propertyTypes: dbItem.property_types ? dbItem.property_types.split(',').filter(type => type.trim()) : [],
      bedroomsMin: parseInt(dbItem.bedrooms_min) || 0,
      location: dbItem.location || '',
      sortBy: dbItem.sort_by || 'newest'
    };
  }
}

export default new FilterService();