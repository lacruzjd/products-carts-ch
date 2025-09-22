import Cart from "../entities/Cart.js"
import CartManager from "../managers/CartManager.js"
import ProductService from '../services/ProductService.js'
import PersistenciaArchivoJsonDAO from "./PersistenciaArchivoJsonDAO.js"

const persisteciaJson = new PersistenciaArchivoJsonDAO('carts.json')
const cartManager = new CartManager(persisteciaJson)

export default class CartService {

    static async createCart() {
        try {
            const newCart = new Cart()

            return cartManager.addCart(newCart)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getAllCarts() {
        try {
            return cartManager.getAllCarts()
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getCartById(id) {
        try {
            return cartManager.getCartById(id)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async addProductToCart(cid, pid) {
        try {
            const cartToAddProduct = await cartManager.getCartById(cid)
            const productToAddCart = await ProductService.getProductsById(pid)
            let products = []
            
            if (cartToAddProduct && productToAddCart) {
                const productExits = cartToAddProduct.products.find(p => p.product === productToAddCart.id)

                if (productExits) {
                    productExits.quantity++
                    products.push(productExits)
                } else {
                    products.push({ product: productToAddCart.id, quantity: 1 })
                }

                await cartManager.updateCart(cid, { products })
            } else {
                throw new Error('Carrito o Producto no encontrado')
            }
        } catch (error) {
            throw new Error(error.message)
        }

    }

    static async deteleProductCart(cid, pid) {
        try {
            const cartToAddProduct = await cartManager.getCartById(cid)

            if (cartToAddProduct) {
                const productExits = cartToAddProduct.products.find(p => p.product === pid)

                if (productExits) {
                    cartToAddProduct.products.forEach(p => {
                        if (p.quantity > 1) {
                            p.quantity--
                        } else {
                            cartToAddProduct.products = cartToAddProduct.products.filter(p => p.product !== pid)
                        }
                    })
                    await cartManager.updateCart(cid, { products: cartToAddProduct.products })
                } else {
                    throw new Error('Producto no encontrado')
                    
                }
                throw new Error('Producto no encontrado')
            } else {
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deteleProductscart(cid) {
        try {
            const cartToAddProduct = await cartManager.getCartById(cid)
            if(cartToAddProduct.products.length > 0) {
                await cartManager.updateCart(cid, { products: [] })               
            } else {
                throw new Error('No hay productos agregados')
            }
                        
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteCart(id) {
        try {
        } catch (error) {
            throw new Error(error.message)
        }
    }
}