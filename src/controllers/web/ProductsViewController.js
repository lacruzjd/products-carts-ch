import UserMongoDAO from "../../dao/mongo/UserMongoDAO.js"
import UserService from "../../services/UserService.js"
import { createToken, verifyToken } from "../../utils/jwtUtils.js"

export default class ProductsViewController {

    constructor(productservice, cartService) {
        this.productservice = productservice
        this.cartService = cartService
    }

    async getProducts(req, res) {
        try {
            const { page, limit, category, order_price } = req.query

            let result = await this.productservice.getProducts(page, limit, category, order_price)

            const user = req.user || null
            let admin = false

            if (user) {
                const userAdmin = await new UserService(new UserMongoDAO).getUserById(user.id)
                if (userAdmin.role === 'admin') {
                    admin = true
                }
            }
            const categorias = await this.productservice.getCategoriesProducts('category')
            const cartCookie = req.cookies.cartId
            let cartId
            if (!cartCookie) {
                const cart = await this.cartService.createCart()
                cartId = cart._id

                let token = createToken({ cartId }, '24h')

                res.cookie('cartId', token, {
                    singed: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
            } else {
                cartId = verifyToken(cartCookie).cartId
            }

            res.render('index', {
                title: 'Products & Carts',
                products: result.docs,
                currentPage: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                categorias,
                user,
                admin,
                cartId: user ? user.cart : cartId

            })
        } catch (error) {
            throw new Error(`Error al cargar productos: ${error.message}`);

        }

    }

    async getRealTimeProducts(req, res) {
        res.render('realTimeProducts', {
            title: 'Agregar Producto'
        })
    }

    async productDetail(req, res) {
        try {
            const { pid } = req.params
            const product = await this.productservice.getProductById(pid)

             const cartCookie = req.cookies.cartId
            let cartId
            if (!cartCookie) {
                const cart = await this.cartService.createCart()
                cartId = cart._id

                let token = createToken({ cartId }, '24h')

                res.cookie('cartId', token, {
                    singed: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
            } else {
                cartId = verifyToken(cartCookie).cartId
            }

            res.render('productdetail', {
                title: 'Detalle Producto',
                product,
                cartId
            })
        } catch (error) {
            throw new Error(`Error al obtener detalles de los  productos: ${error.message}`);

        }

    }
}
