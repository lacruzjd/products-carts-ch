import { Router } from 'express'
import CartModel from '../../models/cartModel.js'
import CartManager from '../../managers/CartManager.js'
import CartService from '../../services/CartService.js'
import CartViewController from '../../controllers/web/CartViewController.js'

import ProductManager from '../../managers/ProductManager.js'
import ProductService from '../../services/ProductService.js'
import ProductModel from '../../models/productModel.js'
import { config } from '../../config/config.js'
import StorageService from '../../services/StorageService.js'

const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productManager = new ProductManager(ProductModel)
const cartManager = new CartManager(CartModel)
const cartService = new CartService(cartManager, productManager)
const productService = new ProductService(productManager, storageImagenes)
const cartViewController = new CartViewController(cartService, productService)

const cartViewRoutes = Router()
cartViewRoutes.get('/', cartViewController.cart.bind(cartViewController))
cartViewRoutes.get('/:cid', cartViewController.getCart.bind(cartViewController))
cartViewRoutes.post('/', cartViewController.deletProduct.bind(cartViewController))
cartViewRoutes.delete('/:cid', cartViewController.deleteAllProducts.bind(cartViewController))


export default cartViewRoutes


