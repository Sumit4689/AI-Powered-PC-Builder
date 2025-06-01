const express = require('express');
const router = express.Router();
const generateBuild = require('../controllers/generateBuild');


router.route("/").post(generateBuild);

module.exports = router;