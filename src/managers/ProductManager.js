//Clase para gestionar los productos
export default class ProductManager {
    constructor(persistencia) {
        this.productPersistencia = persistencia
    }

    async addProducts(newProduct) {
        try {
            return await this.productPersistencia.save(newProduct)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProducts() {
        try {
            const products = await this.productPersistencia.find()
            return products
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos: ${error.message}`)
        }
    }

    async getProductById(id) {
        try {
            const productById = await this.productPersistencia.findById(id)
            return productById
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct(id, data) {
        try {
            return await this.productPersistencia.findByIdAndUpdate(id, data)
        } catch (error) {
            throw new Error(`Error al actualizar: ${error.message}`)
        }
    }

    async deleteProduct(id) {
        try {
            await this.productPersistencia.findByIdAndDelete(id)
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message} `)
        }
    }
}