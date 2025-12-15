import CartModel from '../../models/mongoose/CartModel.js'
import MongoDAO from './MongoDAO.js'

export default class CartMongoDAO extends MongoDAO {
    constructor() {
        super(CartModel)
    }

    async getCartById(cid) {
            return await this.model.findById(cid).populate("products.product").lean()
    }

}