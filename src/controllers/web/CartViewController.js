import CartModel from "../../models/cartModel.js"

export default class CartViewController {
    constructor(service) {
        this.service = service
    }

    async cart(req, res) {
        res.render('cart', {
            title: 'Carrito de compras',
        })
    }

    async getCart(req, res) {
        try {
            const { cid } = req.params
            const cart = await CartModel.findById(cid).populate("products.product").lean()

            res.render('cart', {
                title: 'Carrito de compras',
                cart
            })
        } catch (error) {
            throw new Error(`Ocurio un error al obtener el carrito: ${error.message}`)
        }
    }

    async deletProduct(req, res) {
        try {
            const { cid, pid } = req.body
            await this.service.deleteProductCart(cid, pid)

            return res.render('cart', {
                title: 'Carrito de compras',
                products: await this.service.getCartById(cid)
            })
        } catch (error) {
            throw new Error(`Ocurio un error al eliminar el producto: ${error.message}`)
        }
    }

    async deleteAllProducts(req, res) {
        try {
            const { cid } = req.params
            await this.service.deleteAllProducts(cid)

            return res.render('cart', {
                title: 'Carrito de compras',
                products: await this.service.getCartById(cid)
            })
        } catch (error) {
            throw new Error(`Ocurio un error al eliminar los productos: ${error.message}`)
        }
    }


}