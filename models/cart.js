const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const CartSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true

    },
    cartItems: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        productQuantity: {
            type: Number,
            required: true
        }
    }],
    discount: [{
        code: {
            type: String
        },
        amount: {
            type: Number
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', CartSchema)