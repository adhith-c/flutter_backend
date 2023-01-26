const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CouponSchema = new Schema({
    couponName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    maxLimit: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Coupon', CouponSchema);