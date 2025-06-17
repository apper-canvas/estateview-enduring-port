import filterData from '../mockData/filter.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.data = [...filterData];
  }

  async getDefault() {
    await delay(100);
    return { ...this.data[0] };
  }

  async save(filter) {
    await delay(200);
    this.data[0] = { ...filter };
    return { ...this.data[0] };
  }

  async getPriceRange() {
    await delay(100);
    return {
      min: 100000,
      max: 2000000
    };
  }

  async getPropertyTypes() {
    await delay(100);
    return [
      'House',
      'Apartment',
      'Condo',
      'Townhouse',
      'Villa'
    ];
  }
}

export default new FilterService();