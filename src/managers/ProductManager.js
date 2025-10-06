//Clase para gestionar los productos
export default class ProductManager {
    constructor(modelPersistence) {
        if (!modelPersistence) throw new Error('Debe agregar un modelo de persistencia')
        this.model = modelPersistence
    }

    async addProduct(productToAdd) {
        try {
            const newProduct = new this.model(productToAdd)
            return newProduct.save()
        } catch (error) {
            throw new Error(`Error al guardar producto`)
        }
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
            const productById = await this.model.findById(pid).lean()
            return productById
        } catch (error) {
            throw new Error(`Producto no encontrado`)
        }
    }

    async updateProduct(pid, data) {
        try {
            return await this.model.findByIdAndUpdate(pid, data, { new: true })
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`)
        }
    }

    async deleteProduct(pid) {
        try {
            return await this.model.findByIdAndDelete(pid)
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message} `)
        }
    }

    async getProductAtribute(atribute) {
        try{
            return await this.model.distinct(atribute)
        } catch (error) {
            throw new Error(`Atributo no encontrado ${error.message}`)
        }
    }
}