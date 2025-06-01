const express = require('express');
const router = express.Router();
const { updateUser, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);

module.exports = router;