import mongoose from "mongoose"

const cartSchema = mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number }

    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 7 días
    }
})

cartSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

cartSchema.set('toJSON', { virtual: true })
cartSchema.set('toObject', { virtual: true })

export default mongoose.model('Cart', cartSchema)