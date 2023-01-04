const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const WishlistSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true

    },
    Items: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        }
    }]
})

module.exports = mongoose.model('Wishlist', WishlistSchema)