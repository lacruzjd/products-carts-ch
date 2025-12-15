import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true      
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        required: true
    }
})

productSchema.plugin(mongoosePaginate)
// productSchema.index({code: 1, category: 1})

productSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

productSchema.set('toJSON', {virtual: true})
productSchema.set('toObject', {virtual: true})

export default mongoose.model('Product', productSchema)