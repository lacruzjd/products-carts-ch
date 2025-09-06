import { config } from '../config/config.js'
import { join } from 'path'
import Cart from '../models/Cart.js'
import { ReadWriteFile } from '../services/readWriteFile.js'
import { IdGenerator } from '../services/IdGenerator.js'

// Ruta del archivo para la persistencia de los datos de los carritos de compras
const pathcarts = join(config.paths.db, 'carts.json')

// Funciones para obtener y persistir datos
const getData = async () => await ReadWriteFile.readFile(pathcarts)
const saveData = async (carts) => await ReadWriteFile.writeFIle(pathcarts, carts)

// Clase para gestionar los carros de compra
class CartManager {
    constructor() {
        this.carts = []
        this.pathCart = pathcarts
    }

    async createCart() {
        try {
            this.carts = await getData()

            const newCart = new Cart(IdGenerator.generate())

            this.carts.push(newCart)
            await saveData(this.carts)
            return newCart
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.mensaje}`)
        } finally {
            this.carts = []
        }
    }

    async getAllCarts() {
        try {
            this.carts = await getData()
            return this.carts
        } catch (error) {
            throw new Error(`Error al obtener Lista de Carritos: ${error.message}`)
        }

    }

    async getCartById(id) {
        try {
            this.carts = await getData()
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
            this.carts = await getData()
            const cartToDelete = this.carts.some(c => c.id = cartId)
            
            if (cartToDelete) {
                this.carts = this.carts.filter(c => c.id !== cartId)
                await saveData(this.carts)
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
            this.carts = await getData()
            const cart = await this.carts.find(c => c.id === cartId)
            const product = await productManager.getProductById(productId)

            if (cart && product) {
                if (!cart.products.some(p => p.product === productId)) {
                    ////////////////////////////////////////////////////
                    cart.products.push({ product: productId, quantity: 1 })
                } else {
                    const product = cart.products.find(p => p.product === productId)
                    product.quantity = product.quantity + 1
                    console.log(product)
                }

                saveData(this.carts)
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