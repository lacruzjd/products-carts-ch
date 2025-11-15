import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: String        
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
})

export default mongoose.model('User', userSchema)