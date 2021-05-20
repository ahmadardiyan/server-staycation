const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true
    },
    nameAccount: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Bank', bankSchema)