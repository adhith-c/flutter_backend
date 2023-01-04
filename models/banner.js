const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    highlight: {
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
    }],
    couponName: {
        type: String,
        ref: 'Coupon',
        required: true
    },
    expiresAt: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);