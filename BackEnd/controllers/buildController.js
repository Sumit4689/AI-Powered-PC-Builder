const asyncHandler = require('express-async-handler');
const Build = require('../models/buildModel');

// Save a new build
const saveBuild = asyncHandler(async (req, res) => {
    try {
        console.log('Received build save request for user:', req.user.id);
        console.log('Build data received:', req.body);

        const buildData = {
            ...req.body,
            user: req.user.id
        };

        console.log('Processed build data before saving:', buildData);

        const build = await Build.create(buildData);
        console.log('Build saved successfully:', build);

        res.status(201).json(build);
    } catch (error) {
        console.error('Error saving build:', error);
        res.status(500).json({ message: 'Error saving build', error: error.message });
    }
});

// Get all builds for a user
const getUserBuilds = asyncHandler(async (req, res) => {
    try {
        console.log('Fetching builds for user:', req.user.id);
        
        const builds = await Build.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        
        console.log('Found builds:', builds);
        res.status(200).json(builds);
    } catch (error) {
        console.error('Error fetching builds:', error);
        res.status(500).json({ message: 'Error fetching builds', error: error.message });
    }
});

// Get a specific build by ID
const getBuildById = asyncHandler(async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);
        
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Check if user owns this build or is admin
        if (build.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this build' });
        }

        res.status(200).json(build);
    } catch (error) {
        console.error('Error fetching build:', error);
        res.status(500).json({ message: 'Error fetching build', error: error.message });
    }
});

// Delete a build
const deleteBuild = asyncHandler(async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);
        
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Check if user owns this build or is admin
        if (build.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this build' });
        }

        await build.deleteOne();
        res.status(200).json({ message: 'Build deleted successfully' });
    } catch (error) {
        console.error('Error deleting build:', error);
        res.status(500).json({ message: 'Error deleting build', error: error.message });
    }
});

module.exports = {
    saveBuild,
    getUserBuilds,
    getBuildById,
    deleteBuild
};