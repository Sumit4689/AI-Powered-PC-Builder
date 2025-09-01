import { get, del } from './api';

const AdminService = {
  // Get all users
  getAllUsers: async () => {
    try {
      return await get('/admin/users');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get all builds
  getAllBuilds: async () => {
    try {
      return await get('/admin/builds');
    } catch (error) {
      console.error('Error fetching builds:', error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    try {
      return await del(`/admin/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Delete a build
  deleteBuild: async (buildId) => {
    try {
      return await del(`/admin/builds/${buildId}`);
    } catch (error) {
      console.error(`Error deleting build ${buildId}:`, error);
      throw error;
    }
  }
};

export default AdminService;
