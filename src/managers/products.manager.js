import fs from 'fs/promises'
import { join } from 'path'
import { config } from '../config/config.js'
import crypto from 'crypto'
import Product from '../models/Product.js'

// Ruta para la persiencia de productos
const pathProducts = join(config.paths.db, 'products.json')

//Clase para gestionar los productos
class ProductManager {
    constructor() {
        this.pathProducts = pathProducts
        this.products = []
    }

    async #readFile() {
        try {
            const data = await fs.readFile(this.pathProducts, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(`Ocurrio un error al leer archivo: ${error}`)
        }
    }

    async #writeFile(data) {
        try {
            await fs.writeFile(this.pathProducts, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error(`Ocurrio un error al guardar datos en el archivo: ${error}`)
        }
    }

    #generaId() {
        return crypto.randomUUID()
    }

    async addProducts(product) {
        try {

            this.products = await this.#readFile()

            if (this.products.some(p => p.code === product.code)) {
                throw new Error(`Codigo de producto duplicado.`)
            }

            product.id = crypto.randomUUID()
            
            const newProduct = new Product(product)

            this.products.push(newProduct)

            await this.#writeFile(this.products)
            return newProduct
            
        } catch (error) {
            throw new Error(`Ocurrio un error al guardar el producto. ${error.message}`)
        } finally {
            this.products = []
        }
    }

    async getProducts() {
        try {
            this.products = await this.#readFile()
            return this.products
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos: ${error.message}`)
        } finally {
            this.products = []
        }
    }

    async getProductById(id) {
        try {
            this.products = await this.#readFile()
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
            this.products = await this.#readFile()
            const productToUpdate = this.products.find(p => p.id === id)

            if (productToUpdate) {
                Object.keys(await product).forEach(k => {
                    if (k !== productToUpdate[k] && k !== 'id') {
                        productToUpdate[k] = product[k]
                    } else {
                        throw new Error('No se puede actualizar el id del producto')
                    }
                })

                await this.#writeFile(this.products)
            } else {
                throw new Error(`Producto no encontrado: ${error.message}`)
            }

        } catch (error) {
            throw new Error(error.message)
        } finally {
            this.products = []
        }

    }

    async deleteProduct(id) {
        try {
            this.products = await this.#readFile()
            const productToDelete = this.products.some(p => p.id === id)

            if (productToDelete) {
                this.products = this.products.filter(p => p.id !== id)
                await this.#writeFile(this.products)
            } else {
                throw new Error(`Producto no encontrado`)
            }

        } catch (error) {
            throw new Error(`Error al eliminar producto ${error} `)
        } finally {
            this.products = []
        }
    }
}

export default ProductManager