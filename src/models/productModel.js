import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
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
        index: true,
        unique: true
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

export default mongoose.model('Product', userSchema)