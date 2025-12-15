import { Router } from 'express'
import CartManager from '../../dao/mongo/CartMongoDAO.js'
import CartService from '../../services/CartService.js'
import CartViewController from '../../controllers/web/CartViewController.js'

import ProductManager from '../../dao/mongo/ProductMongoDAO.js'
import ProductService from '../../services/ProductService.js'
import { config } from '../../config/config.js'
import StorageService from '../../services/StorageService.js'

const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productManager = new ProductManager()
const cartService = new CartService(new CartManager(), productManager)
const productService = new ProductService(productManager, storageImagenes)
const cartViewController = new CartViewController(cartService, productService)

const cartViewRoutes = Router()
cartViewRoutes.get('/', cartViewController.getCart.bind(cartViewController))
cartViewRoutes.get('/:cid', cartViewController.getCart.bind(cartViewController))
cartViewRoutes.post('/', cartViewController.deletProduct.bind(cartViewController))
cartViewRoutes.delete('/:cid', cartViewController.deleteAllProducts.bind(cartViewController))
cartViewRoutes.put('/:cid/product/:pid', cartViewController.ubdateQtyProduct.bind(cartViewController))

export default cartViewRoutes


