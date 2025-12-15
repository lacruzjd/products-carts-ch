import { createToken, verifyToken } from "../../utils/jwtUtils.js"
import userService from '../../services/UserService.js'
import UserMongoDao from '../../dao/mongo/UserMongoDao.js'
import UserDto from "../../dto/UserDTO.js"


export default class CartController {
    constructor(cartService, productService) {
        this.cartService = cartService
        this.productService = productService
    }

    async createCart(req, res) {
        try {
            let cartId = null

            const cartCookie = req.cookies.cartId
            const userlogin = req.cookies.authCookie

            if (!cartCookie && !userlogin) {
                const cart = await this.cartService.createCart()
                cartId = cart._id

                let token = createToken({ cartId }, '24h')

                res.cookie('cartId', token, {
                    singed: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })

                res.status(201).json({ mensaje: 'Carrito creado con exito', id: cartId })
            }

            if (userlogin && cartCookie) {
                cartId = verifyToken(cartCookie)
                cartId = cartId.cartId
                res.user.cart = cartId
                res.status(201).json({ mensaje: 'Carrito Pendiente', id: cartId })
            }

            if (userlogin && !cartCookie) {
                const cart = await this.cartService.createCart()
                const cartId = cart._id

                const user = verifyToken(userlogin)
                const userlog = await new userService(new UserMongoDao()).getUserById(user.id)
                const userdao = new UserDto(userlog)
                userdao.cart = cartId


                let token = createToken({ ...userdao }, '24h')

                res.cookie('authCookie', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'strict'
                })
                res.status(201).json({ mensaje: 'Carrito creado con exito', id: cartId })

            }

        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await this.cartService.getCarts()
            if (carts.length === 0) throw new Error('No hay carritos guardados')
            const cartsIds = carts.map(cart => { return { cid: cart._id } })
            res.status(200).json(cartsIds)
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params
            if (!cid) throw new Error('Se requiere el id del carrito')
            const productsInCart = await this.cartService.getCartById(cid)
            res.status(200).json(productsInCart.products)
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }


    async addProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            if (!pid) throw new Error('Se requiere el id del producto')
            if (!cid) throw new Error('Se requiere el id del carrito')

            const userlogin = req.cookies.authCookie
            const user = verifyToken(userlogin)

            if (cid !== user.cart) throw new Error('El carrito no pertenece al usuario logeado')


            await this.cartService.addProductToCart(cid, pid)
            res.status(201).json({ mensaje: 'Producto agreagdo al carrito' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async deleteProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            if (!pid) throw new Error('Se requiere el id del producto')
            if (!cid) throw new Error('Se requiere el id del carrito')

            const userlogin = req.cookies.authCookie
            const user = verifyToken(userlogin)

            if (cid !== user.cart) throw new Error('El carrito no pertenece al usuario logeado')

            await this.cartService.deleteProductCart(cid, pid)
            res.status(201).json({ mensaje: 'Producto eliminado del carrito' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async updateProducts(req, res) {
        try {
            const { cid } = req.params
            if (!cid) throw new Error('Se requiere el id del carrito')

            const userlogin = req.cookies.authCookie
            const user = verifyToken(userlogin)

            if (cid !== user.cart) throw new Error('El carrito no pertenece al usuario logeado')
            const newProducts = req.body
            await this.cartService.updateProducts(cid, newProducts)
            res.status(201).json({ mensaje: 'Productos actualizados' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async updateQtyProductCart(req, res) {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
            if (!pid) throw new Error('Se requiere el id del producto')
            if (!cid) throw new Error('Se requiere el id del carrito')
            if (!quantity) throw new Error('Se requiere la cantidad del producto')

            const userlogin = req.cookies.authCookie
            const user = verifyToken(userlogin)

            if (cid !== user.cart) throw new Error('El carrito no pertenece al usuario logeado')

            await this.cartService.updateQtyProductCart(cid, pid, Number(quantity))
            res.status(200).json({ mensaje: 'Cantidad del producto actualizada' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }

    async deleteAllProducts(req, res) {
        try {
            const { cid } = req.params
            const userlogin = req.cookies.authCookie
            const user = verifyToken(userlogin)

            if (cid !== user.cart) throw new Error('El carrito no pertenece al usuario logeado')
            await this.cartService.deleteAllProducts(cid)
            res.status(201).json({ mensaje: 'Carrito vaciado exitosamente' })
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    }
}
