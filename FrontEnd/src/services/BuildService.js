import { get, post, del } from './api';

const BuildService = {
  // Get user builds
  getUserBuilds: async () => {
    try {
      return await get('/api/builds/user');
    } catch (error) {
      console.error('Error fetching user builds:', error);
      throw error;
    }
  },

  // Get a specific build by ID
  getBuildById: async (buildId) => {
    try {
      return await get(`/api/builds/${buildId}`);
    } catch (error) {
      console.error(`Error fetching build ${buildId}:`, error);
      throw error;
    }
  },

  // Save a build
  saveBuild: async (buildData) => {
    try {
      return await post('/api/builds/save', buildData);
    } catch (error) {
      console.error('Error saving build:', error);
      throw error;
    }
  },

  // Delete a build
  deleteBuild: async (buildId) => {
    try {
      return await del(`/api/builds/${buildId}`);
    } catch (error) {
      console.error(`Error deleting build ${buildId}:`, error);
      throw error;
    }
  },

  // Generate a build based on user requirements
  generateBuild: async (requirements) => {
    try {
      return await post('/api/generateBuild', requirements);
    } catch (error) {
      console.error('Error generating build:', error);
      throw error;
    }
  }
};

export default BuildService;
