const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/registration');

router.route("/").post(registerUser);

module.exports = router;