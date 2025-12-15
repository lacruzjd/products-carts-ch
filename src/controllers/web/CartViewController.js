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
            let { cid } = req.params
            let cart = null

            if (cid) {
                cart = await this.service.getCartById(cid)
            } else {
                cid = req.cookies.cartId
                cart = await this.service.getCartById(cid)
            }

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

            res.clearCookie('cartId')

            return res.render('cart', {
                title: 'Carrito de compras',
                products: await this.service.getCartById(cid)
            })
        } catch (error) {
            throw new Error(`Ocurio un error al eliminar los productos: ${error.message}`)
        }
    }

    async ubdateQtyProduct(req, res) {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
            await this.service.updateQtyProductCart(cid, pid, quantity)
        } catch (error) {
            throw new Error(`Ocurrio un error al actualizar la cantidad: ${error.message}`)
        }
    }
}