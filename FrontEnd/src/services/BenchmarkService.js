import axios from 'axios';

const API_URL = 'http://localhost:11822/benchmarks';

const BenchmarkService = {
  // Get all benchmarks with optional filters
  getBenchmarks: async (filters = {}) => {
    const { componentType, brand, sort, limit } = filters;
    let url = API_URL;
    
    // Add query parameters
    const params = new URLSearchParams();
    if (componentType) params.append('componentType', componentType);
    if (brand) params.append('brand', brand);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      throw error;
    }
  },

  // Get a specific benchmark by ID
  getBenchmarkById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching benchmark ${id}:`, error);
      throw error;
    }
  },

  // Compare multiple benchmarks
  compareBenchmarks: async (ids) => {
    try {
      const response = await axios.post(`${API_URL}/compare`, { ids });
      return response.data;
    } catch (error) {
      console.error('Error comparing benchmarks:', error);
      throw error;
    }
  },

  // Get all available component types
  getComponentTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/types/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching component types:', error);
      throw error;
    }
  },

  // Get brands by component type
  getBrandsByType: async (componentType) => {
    try {
      const response = await axios.get(`${API_URL}/brands/${componentType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brands for ${componentType}:`, error);
      throw error;
    }
  }
};

export default BenchmarkService;
