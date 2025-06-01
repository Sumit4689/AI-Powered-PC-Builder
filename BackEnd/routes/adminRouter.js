const express = require('express');
const router = express.Router();
const { getAllUsers, getAllBuilds, deleteUser, deleteBuild } = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/users', verifyToken, getAllUsers);
router.get('/builds', verifyToken, getAllBuilds);
router.delete('/users/:id', verifyToken, deleteUser);
router.delete('/builds/:id', verifyToken, deleteBuild);

module.exports = router;