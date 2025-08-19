const express = require('express');
const router = express.Router();
const { 
    getBenchmarks, 
    getBenchmarkById, 
    compareBenchmarks,
    getComponentTypes,
    getBrandsByType
} = require('../controllers/benchmarkController');

// Get all benchmarks with filtering
router.get('/', getBenchmarks);

// Get benchmark by ID
router.get('/:id', getBenchmarkById);

// Compare multiple benchmarks
router.post('/compare', compareBenchmarks);

// Get all available component types
router.get('/types/all', getComponentTypes);

// Get brands by component type
router.get('/brands/:componentType', getBrandsByType);

module.exports = router;
