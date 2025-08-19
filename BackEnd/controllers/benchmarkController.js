const Benchmark = require('../models/benchmarkModel');

// Get all benchmarks with filtering options
exports.getBenchmarks = async (req, res) => {
    try {
        const { componentType, brand, sort, limit = 10 } = req.query;
        
        // Build query object
        const query = {};
        if (componentType) query.componentType = componentType;
        if (brand) query.brand = brand;
        
        // Determine sort order
        let sortOption = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption[field] = order === 'desc' ? -1 : 1;
        } else {
            // Default sort by name
            sortOption = { name: 1 };
        }
        
        const benchmarks = await Benchmark.find(query)
            .sort(sortOption)
            .limit(Number(limit));
        
        res.status(200).json({
            success: true,
            count: benchmarks.length,
            data: benchmarks
        });
    } catch (error) {
        console.error('Error fetching benchmarks:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get benchmark by ID
exports.getBenchmarkById = async (req, res) => {
    try {
        const benchmark = await Benchmark.findById(req.params.id);
        
        if (!benchmark) {
            return res.status(404).json({
                success: false,
                error: 'Benchmark not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: benchmark
        });
    } catch (error) {
        console.error('Error fetching benchmark:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Compare benchmarks
exports.compareBenchmarks = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Please provide at least two benchmark IDs for comparison'
            });
        }
        
        const benchmarks = await Benchmark.find({ _id: { $in: ids } });
        
        if (benchmarks.length !== ids.length) {
            return res.status(404).json({
                success: false,
                error: 'One or more benchmarks not found'
            });
        }
        
        // Check if all components are of the same type
        const componentTypes = new Set(benchmarks.map(b => b.componentType));
        if (componentTypes.size !== 1) {
            return res.status(400).json({
                success: false,
                error: 'Can only compare components of the same type'
            });
        }
        
        res.status(200).json({
            success: true,
            data: benchmarks
        });
    } catch (error) {
        console.error('Error comparing benchmarks:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get available component types
exports.getComponentTypes = async (req, res) => {
    try {
        const types = await Benchmark.distinct('componentType');
        
        res.status(200).json({
            success: true,
            data: types
        });
    } catch (error) {
        console.error('Error fetching component types:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get brands by component type
exports.getBrandsByType = async (req, res) => {
    try {
        const { componentType } = req.params;
        
        const brands = await Benchmark.distinct('brand', { 
            componentType: componentType 
        });
        
        res.status(200).json({
            success: true,
            data: brands
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
