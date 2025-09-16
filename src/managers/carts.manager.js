import Cart from '../models/Cart.js'
import { IdGenerator } from '../services/IdGenerator.js'
import ProductManager from './products.manager.js'
import PersistenciaArchivoJson from '../services/PersistenciaArchivoJson.js'
import { config } from '../config/config.js'
import path from 'path'

// Ruta para la obtencion de los productos
const pathProducts = path.join(config.paths.db, 'products.json')
const persistencia = new PersistenciaArchivoJson(pathProducts)
const productManager = new ProductManager(persistencia)

// Clase para gestionar los carros de compra
class CartManager {
    constructor(persistencia) {
        this.carts = []
        this.persistencia = persistencia
    }

    async createCart() {
        try {
            this.carts = await this.persistencia.getData()

            const newCart = new Cart(IdGenerator.generate())
            this.carts.push(newCart)
            await this.persistencia.saveData(this.carts)

            return newCart
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.mensaje}`)
        } finally {
            this.carts = []
        }
    }

    async getAllCarts() {
        try {
            this.carts = await this.persistencia.getData()
            return this.carts
        } catch (error) {
            throw new Error(`Error al obtener Lista de Carritos: ${error.message}`)
        }

    }

    async getCartById(id) {
        try {
            this.carts = await this.persistencia.getData()
            const cartById = await this.carts.find(c => c.id === id)
            if (!cartById) {
                throw new Error('Carrito no encontrado')
            }
            return cartById
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`)
        } finally {
            this.carts = []
        }
    }

    async deleteCart(cartId) {
        try {
            this.carts = await this.persistencia.getData()
            const cartToDelete = this.carts.some(c => c.id = cartId)

            if (cartToDelete) {
                this.carts = this.carts.filter(c => c.id !== cartId)
                await this.persistencia.saveData(this.carts)
            } else {
                throw new Error(`Carrito no encontrado`)
            }
        } catch (error) {
            throw Error('Error al eliminar Carrito')
        } finally {
            this.carts = []
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            this.carts = await this.persistencia.getData()

            const cart = await this.carts.find(c => c.id === cartId)
            const product = await productManager.getProductById(productId)

            if (cart && product) {

                if (!cart.products.some(p => p.product === productId)) {
                    cart.products.push({ product: productId, quantity: 1 })
                } else {
                    const product = cart.products.find(p => p.product === productId)
                    product.quantity = product.quantity + 1
                }

                this.persistencia.saveData(this.carts)
                return cart
            } else {
                throw new Error('Carrito o Producto no encontrado')
            }

        } catch (error) {
            throw new Error(`Error al agregar producto ${error}`)
        } finally {
            this.carts = []
        }
    }
}

export default CartManager