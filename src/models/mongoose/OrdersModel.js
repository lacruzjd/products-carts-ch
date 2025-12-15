import { Schema, model } from 'mongoose'

const OrderSchema = new Schema({
    business: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    totalPrice: Number
})

export default model('Order', OrderSchema)