import { Schema, model } from 'mongoose'

const Ticket = new Schema({
    dateTime: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    totalPrice: Number
})

export default model('Ticket', Ticket)
