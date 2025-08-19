const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    name: String,
    type: String,
    specs: String,
    price: Number,
    rationale: String
}, { _id: false });

const buildSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    buildName: {
        type: String,
        required: true,
        default: 'My Custom Build'
    },
    summary: {
        type: String,
        required: true
    },
    components: [componentSchema],
    totalCost: {
        type: Number,
        required: true
    },
    compatibilityNotes: String,
    reviewComponents: [String],
    youtubeReviews: [{
        title: String,
        description: String,
        thumbnail: String,
        videoId: String,
        component: String
    }],
    useCase: String
}, {
    timestamps: true
});

module.exports = mongoose.model('build', buildSchema);