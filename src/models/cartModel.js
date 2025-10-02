import mongoose from "mongoose"

const cartSchema = mongoose.Schema({
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        quantity: {type: Number}

    }]
})

cartSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

cartSchema.set('toJSON', {virtual: true})
cartSchema.set('toObject', {virtual: true})

export default mongoose.model('Cart', cartSchema)