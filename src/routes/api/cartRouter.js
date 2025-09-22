import { Router } from 'express'
import {
    addProductToCart,
    createCart,
    deleteCart,
    getCartById,
    getCarts,
    deteleProductCart,
    deteleProductscart
} from '../../controllers/api/cartController.js'

const cartsRouter = Router()
cartsRouter.get('/', getCarts)
cartsRouter.post('/', createCart)
cartsRouter.get('/:cid', getCartById)
cartsRouter.post('/:cid/product/:pid', addProductToCart)
cartsRouter.delete('/:cid/product/:pid', deteleProductCart)
cartsRouter.delete('/:cid/products', deteleProductscart)
cartsRouter.delete('/:cid', deleteCart)

export default cartsRouter