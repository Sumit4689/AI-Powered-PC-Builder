import { get, post } from './api';

// Endpoint for benchmark operations
const BENCHMARK_ENDPOINT = '/api/benchmarks';

const BenchmarkService = {
  // Get all benchmarks with optional filters
  getBenchmarks: async (filters = {}) => {
    const { componentType, brand, sort, limit } = filters;
    
    // Add query parameters
    const params = new URLSearchParams();
    if (componentType) params.append('componentType', componentType);
    if (brand) params.append('brand', brand);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `${BENCHMARK_ENDPOINT}?${queryString}` : BENCHMARK_ENDPOINT;
    
    try {
      return await get(endpoint);
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      throw error;
    }
  },

  // Get a specific benchmark by ID
  getBenchmarkById: async (id) => {
    try {
      return await get(`${BENCHMARK_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error fetching benchmark ${id}:`, error);
      throw error;
    }
  },

  // Compare multiple benchmarks
  compareBenchmarks: async (ids) => {
    try {
      return await post(`${BENCHMARK_ENDPOINT}/compare`, { ids });
    } catch (error) {
      console.error('Error comparing benchmarks:', error);
      throw error;
    }
  },

  // Get all available component types
  getComponentTypes: async () => {
    try {
      return await get(`${BENCHMARK_ENDPOINT}/types/all`);
    } catch (error) {
      console.error('Error fetching component types:', error);
      throw error;
    }
  },

  // Get brands by component type
  getBrandsByType: async (componentType) => {
    try {
      return await get(`${BENCHMARK_ENDPOINT}/brands/${componentType}`);
    } catch (error) {
      console.error(`Error fetching brands for ${componentType}:`, error);
      throw error;
    }
  }
};

export default BenchmarkService;
