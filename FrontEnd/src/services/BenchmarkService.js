import api from './api';

const ENDPOINT = '/benchmarks';

const BenchmarkService = {
  // Get all benchmarks with optional filters
  getBenchmarks: async (filters = {}) => {
    const { componentType, brand, sort, limit } = filters;
    
    // Add query parameters
    const params = {};
    if (componentType) params.componentType = componentType;
    if (brand) params.brand = brand;
    if (sort) params.sort = sort;
    if (limit) params.limit = limit;
    
    try {
      const response = await api.get(ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      throw error;
    }
  },

  // Get a specific benchmark by ID
  getBenchmarkById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching benchmark ${id}:`, error);
      throw error;
    }
  },

  // Compare multiple benchmarks
  compareBenchmarks: async (ids) => {
    try {
      const response = await api.post(`${ENDPOINT}/compare`, { ids });
      return response.data;
    } catch (error) {
      console.error('Error comparing benchmarks:', error);
      throw error;
    }
  },

  // Get all available component types
  getComponentTypes: async () => {
    try {
      const response = await api.get(`${ENDPOINT}/types/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching component types:', error);
      throw error;
    }
  },

  // Get brands by component type
  getBrandsByType: async (componentType) => {
    try {
      const response = await api.get(`${ENDPOINT}/brands/${componentType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brands for ${componentType}:`, error);
      throw error;
    }
  }
};

export default BenchmarkService;
