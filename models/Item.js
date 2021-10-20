const mongoose = require("mongoose");
const ObjectId = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean
    },
    description: {
        type: String,
        requried: true
    },
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    featureId: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activityId: [{
        type: ObjectId,
        ref: 'Activity'
    }]
});

module.exports = mongoose.model('Item', itemSchema)