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

    async getProducts() {
        try {
            return await this.model.find()
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos`)
        }
    }

    async getProductById(pid) {
        console.log('manager', pid)
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
}