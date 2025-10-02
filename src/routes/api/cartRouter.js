import { Router } from 'express'
import CartModel from '../../models/cartModel.js'
import CartManager from '../../managers/CartManager.js'
import CartService from '../../services/CartService.js'
import CartController from '../../controllers/api/cartController.js'

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
const cartController = new CartController(cartService, productService)

const cartsRouter = Router()
cartsRouter.post('/', cartController.createCart.bind(cartController))
cartsRouter.post('/:cid/product/:pid', cartController.addProductCart.bind(cartController))
cartsRouter.get('/:cid', cartController.getCartById.bind(cartController))
cartsRouter.get('/', cartController.getCarts.bind(cartController))

cartsRouter.delete('/:cid/product/:pid', cartController.deleteProductCart.bind(cartController))
cartsRouter.put('/:cid', cartController.updateProducts.bind(cartController))
cartsRouter.put('/:cid/product/:pid', cartController.updateQtyProductCart.bind(cartController))
cartsRouter.delete('/:cid', cartController.deleteAllProducts.bind(cartController))

export default cartsRouter