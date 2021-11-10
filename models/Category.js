const mongoose = require("mongoose");
const { ObjectId } = mongoose.schema;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ItemId: [{
        type: ObjectId,
        ref: 'Item'
    }]
});

module.exports = mongoose.model('Category', categorySchema)