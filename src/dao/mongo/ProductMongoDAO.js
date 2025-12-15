import ProductModel from '../../models/mongoose/ProductModel.js'
import MongoDAO from './MongoDAO.js'

export default class ProductMongoDAO extends MongoDAO {
    constructor() {
        super(ProductModel)
    }

    async getProducts(page, limit, category, order_price) {
        try {

            const filtro = {
            }

            if (category) filtro.category = category

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: order_price === 'desc' ? -1 : 1 },
                lean: true,
                leanWithId: true
            }

            return await this.model.paginate(filtro, options)
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos ${error.message}`)
        }
    }

    async getProductById(pid) {
        try {
            return await this.model.findById(pid).lean()
        } catch (error) {
            throw new Error(`Producto no encontrado ${error.message}`)
        }
    }

    async getProductAtribute(atribute) {
        try {
            return await this.model.distinct(atribute)
        } catch (error) {
            throw new Error(`Atributo no encontrado ${error.message}`)
        }
    }
}
