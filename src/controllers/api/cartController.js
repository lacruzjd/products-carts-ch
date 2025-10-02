import cartModel from "../../models/cartModel.js"

export default class CartController {
    constructor(cartService, productService) {
        this.cartService = cartService
        this.productService = productService
    }

    async createCart(req, res) {
        try {
            const cartId = await this.cartService.createCart()
            res.status(201).json({ mensaje: 'Carrito creado con exito', id: cartId._id })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await this.cartService.getCarts()
            if (carts.length === 0) throw new Error('No hay carritos guardados')
            res.status(200).json(carts)
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params
            const productsInCart = await cartModel.findById(cid).populate("products.product").lean()
            res.status(200).json(productsInCart.products)
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async addProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            await this.cartService.addProductToCart(cid, pid)
            res.status(201).json({ mensaje: 'Producto agreagdo al carrito' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async deleteProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            await this.cartService.deleteProductCart(cid, pid)
            res.status(201).json({ mensaje: 'Producto eliminado del carrito' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async updateProducts(req, res) {
        try {
            const { cid } = req.params
            const newProducts = req.body
            await this.cartService.updateAllProducts(cid, newProducts)
            res.status(201).json({ mensaje: 'Productos actualizados' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async updateQtyProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body

            await this.cartService.updateQtyProductCart(cid, pid, Number(quantity))
            res.status(200).json({ mensaje: 'Cantidad del producto actualizada' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async deleteAllProducts(req, res) {
        try {
            const { cid } = req.params
            await this.cartService.deleteAllProducts(cid)
            res.status(201).json({ mensaje: 'Carrito vaciado exitosamente' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

}