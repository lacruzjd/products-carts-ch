import { Router } from 'express'
import CartMongoDAO from '../../dao/mongo/CartMongoDAO.js'
import CartService from '../../services/CartService.js'
import CartController from '../../controllers/api/cartController.js'

import ProductManager from '../../dao/mongo/ProductMongoDAO.js'
import ProductService from '../../services/ProductService.js'
import { config } from '../../config/config.js'
import StorageService from '../../services/StorageService.js'
import { authAdmin} from '../../middlerwares/auth.js'

const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productManager = new ProductManager()
const cartMongoDao = new CartMongoDAO()
const cartService = new CartService(cartMongoDao, productManager)
const productService = new ProductService(productManager, storageImagenes)
const cartController = new CartController(cartService, productService)

const cartsRouter = Router()
cartsRouter.get('/', authAdmin, cartController.getCarts.bind(cartController))
cartsRouter.post('/', cartController.createCart.bind(cartController))

cartsRouter.get('/:cid', cartController.getCartById.bind(cartController))
cartsRouter.post('/:cid/product/:pid', cartController.addProductCart.bind(cartController))

cartsRouter.delete('/:cid/product/:pid', cartController.deleteProductCart.bind(cartController))
cartsRouter.put('/:cid', cartController.updateProducts.bind(cartController))
cartsRouter.put('/:cid/product/:pid', cartController.updateQtyProductCart.bind(cartController))
cartsRouter.delete('/:cid', cartController.deleteAllProducts.bind(cartController))

export default cartsRouter