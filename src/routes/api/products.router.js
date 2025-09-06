import {Router} from 'express'
import { addProducts, deleteProduct, getProductById, getProducts, updateProduct } from '../../controllers/api/products.controller.js'

const productsRouter = Router()

productsRouter.get('/', getProducts)
productsRouter.get('/:pid', getProductById)
productsRouter.post('/', addProducts)
productsRouter.put('/:pid', updateProduct)
productsRouter.delete('/:pid', deleteProduct)

export default productsRouter