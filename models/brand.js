const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    brandName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        url: String,
        filename: String
    }]
});

module.exports = mongoose.model('Brand', BrandSchema);