import crypto from 'crypto'
import Product from '../models/Product.js'

//Clase para gestionar los productos
export default class ProductManager {
    constructor(persistencia) {
        this.products = []
        this.persistencia = persistencia
    }

    async addProducts(product) {
        try {
            this.products = await this.persistencia.getData()

            if (this.products.some(p => p.code === product.code)) {
                throw new Error(`Codigo de producto duplicado.`)
            }

            product.id = crypto.randomUUID()

            const newProduct = new Product(product)

            this.products.push(newProduct)

            await this.persistencia.saveData(this.products)
            return newProduct

        } catch (error) {
            throw new Error(`Ocurrio un error al guardar el producto. ${error.message}`)
        } finally {
            this.products = []
        }
    }

    async getProducts() {
        try {
            this.products = await this.persistencia.getData()
            return this.products
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos: ${error.message}`)
        } finally {
            this.products = []
        }
    }

    async getProductById(id) {
        try {
            this.products = await this.persistencia.getData()
            const productById = this.products.find(p => p.id === id)

            if (!productById) {
                throw new Error(`Not found`)
            }
            return productById
        } catch (error) {
            throw new Error('Producto no encontrado')
        } finally {
            this.products = []
        }
    }

    async updateProduct(id, product) {
        try {
            this.products = await this.persistencia.getData()

            const productToUpdate = this.products.find(p => p.id === id)

            if (productToUpdate) {
                Object.keys(await product).forEach(k => {
                    if (k !== productToUpdate[k] && k !== 'id') {
                        productToUpdate[k] = product[k]
                    } else {
                        throw new Error('No se puede actualizar el id del producto')
                    }
                })

                await this.persistencia.saveData(this.products)
                return productToUpdate
            } else {
                throw new Error(`Producto no encontrado`)
            }

        } catch (error) {
            throw new Error(error.message)
        } finally {
            this.products = []
        }
    }

    async deleteProduct(id) {
        try {
            this.products = await this.persistencia.getData()
            const productToDelete = this.products.find(p => p.id === id)

            if (productToDelete) {

                this.products = this.products.filter(p => p.id !== id) || []
                await this.persistencia.saveData(this.products)
                return productToDelete

            } else {
                throw new Error(`Producto no encontrado`)
            }

        } catch (error) {
            throw new Error(`Error al eliminar producto ${error.message} `)
        } finally {
            this.products = []
        }
    }
}