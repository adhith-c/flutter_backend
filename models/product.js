const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productname: {
        type: String,
        required: true

    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    stock: {
        type: Number
    },
    brand: {
        type: String,
        ref: 'Brand',
        required: true
    },
    category: {
        type: String,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },

    image: [{
        url: String,
        filename: String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)