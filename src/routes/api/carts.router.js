import { Router } from 'express'
import { addProductToCart, createCart, deleteCart, getCartById, getCarts } from '../../controllers/api/carts.controller.js'

const cartsRouter = Router()

cartsRouter.get('/', getCarts)
cartsRouter.post('/', createCart)
cartsRouter.get('/:cid', getCartById)
cartsRouter.post('/:cid/product/:pid', addProductToCart)
cartsRouter.delete('/:cid', deleteCart)

export default cartsRouter