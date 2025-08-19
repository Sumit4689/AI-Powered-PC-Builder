const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Build = require('../models/buildModel');

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get all builds
const getAllBuilds = asyncHandler(async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const builds = await Build.find({}).populate('user', 'name email');
        res.status(200).json(builds);
    } catch (error) {
        console.error('Error in getAllBuilds:', error);
        res.status(500).json({ message: 'Error fetching builds' });
    }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all builds associated with this user
        await Build.deleteMany({ user: req.params.id });
        res.status(200).json({ message: 'User and associated builds deleted' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Delete build
const deleteBuild = asyncHandler(async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const build = await Build.findByIdAndDelete(req.params.id);
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        res.status(200).json({ message: 'Build deleted' });
    } catch (error) {
        console.error('Error in deleteBuild:', error);
        res.status(500).json({ message: 'Error deleting build' });
    }
});

module.exports = {
    getAllUsers,
    getAllBuilds,
    deleteUser,
    deleteBuild
};