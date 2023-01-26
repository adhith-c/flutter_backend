const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const OrderSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    addressDetails: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        }
    },
    orderItems: [{

        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        productQuantity: {
            type: Number,
            required: true
        },
        productPrice: {
            type: Number,
            required: true
        }

    }],

    totalAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'notpaid'
    },

    orderStatus: {
        type: String,
        default: 'ordered'
    },
    orderNotes: {
        type: String
    },
    paymentId: {
        type: String
    },
    discount: [{
        code: {
            type: String
        },
        amount: {
            type: Number
        }
    }],
    isComplete: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema)