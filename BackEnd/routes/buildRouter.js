const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Import build controller functions
const { 
    saveBuild,
    getUserBuilds,
    getBuildById,
    deleteBuild
} = require('../controllers/buildController');

// Apply auth middleware to all routes
router.use(verifyToken);

// Build routes
router.post('/save', saveBuild);
router.get('/user', getUserBuilds);
router.get('/:id', getBuildById);
router.delete('/:id', deleteBuild);

module.exports = router;