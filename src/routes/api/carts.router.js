import { Router } from 'express'
import { addProductToCart, createCart, deleteCart, gerCartById, getCarts } from '../../controllers/api/carts.controller.js'

const cartsRouter = Router()

cartsRouter.get('/', getCarts)
cartsRouter.post('/', createCart)
cartsRouter.get('/:cid', gerCartById)
cartsRouter.post('/:cid/product/:pid', addProductToCart)
cartsRouter.delete('/:cid', deleteCart)

export default cartsRouter