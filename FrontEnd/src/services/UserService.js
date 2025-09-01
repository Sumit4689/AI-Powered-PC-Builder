import { get, post, put, del } from './api';

const UserService = {
  // Login user
  login: async (credentials) => {
    try {
      return await post('/login', credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      return await post('/register', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      return await put('/users/update', userData);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async () => {
    try {
      return await del('/users/delete');
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  }
};

export default UserService;
