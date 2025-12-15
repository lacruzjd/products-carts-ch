import UserService from "./UserService.js"
import UserMongoDAO from "../dao/mongo/UserMongoDAO.js"
import CartService from "./CartService.js"
import CartMongoDAO from "../dao/mongo/CartMongoDAO.js"
import ProductMongoDAO from "../dao/mongo/ProductMongoDAO.js"
import ProductService from "./ProductService.js"
import TicketMongoDAO from "../dao/mongo/TicketMongoDAO.js"
import Ticket from '../entities/Ticket.js'
import TicketDto from "../dto/TicketDto.js"
import UserDto from "../dto/UserDTO.js"
import ProductDto from "../dto/ProductDto.js"

const productDao = new ProductMongoDAO()
const productService = new ProductService(productDao)

const userDao = new UserMongoDAO()
const userService = new UserService(userDao)

const cartDao = new CartMongoDAO()
const cartService = new CartService(cartDao, productDao)

const ticketDao = new TicketMongoDAO()

export default class TicketService {
    constructor() {
        this.ticketDao = ticketDao
    }

    async createTicket(cartId, userId) {

        const user = await userService.getUserById(userId)
        const cart = await cartService.getCartById(cartId)

        if (!cart) throw new Error('No hay carrito asociado al usuario')

        const products = cart.products

        if (products.length === 0) throw new Error('El carrito esta vacio')

        products.forEach(async product => {
            const productSaved = await productService.getProductById(product.product._id)
            if (productSaved.stock < product.quantity) {
                throw new Error('No hay stock suficiente del producto')
            }
            productSaved.stock -= product.quantity
            await productService.updateProduct(productSaved._id, productSaved)
        })

        const totalPrice = products.reduce((total, product) => {
            return total + product.product.price * product.quantity
        }, 0)

        const status = 'Pagado (venta Simulada)'
        const ticket = await this.ticketDao.save({ dateTime: new Date(), userId: user._id, status, products, totalPrice })
        const productsInCart = products.map(product => {
            const productDto = new ProductDto(product.product)
            return { product: productDto, quantity: product.quantity }
        })
        const ticketData = new Ticket(ticket._id, ticket.datetime, new UserDto(user), status, productsInCart, totalPrice)

        await cartService.deleteCart(cartId)

        return ticketData
    }

    async getTicketById(tid) {
        return await this.ticketDao.getById(tid)
    }
}