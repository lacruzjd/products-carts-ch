import { Router } from 'express'
import { config } from '../../config/config.js'
import StorageService from '../../services/StorageService.js'

import ProductModel from '../../models/productModel.js'
import ProductManager from '../../managers/ProductManager.js'
import ProductService from '../../services/ProductService.js'
import ProductsViewController from '../../controllers/web/productsViewController.js'

import CartModel from '../../models/cartModel.js'
import CartManager from '../../managers/CartManager.js'
import CartService from '../../services/CartService.js'

const productManager = new ProductManager(ProductModel)
const cartManager = new CartManager(CartModel)
const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService(productManager, storageImagenes)
const cartService = new CartService(cartManager, productManager)
const productController = new ProductsViewController(productService, cartService)

const productsViewRouter = Router()
productsViewRouter.get('/', productController.getProducts.bind(productController))
productsViewRouter.get('/realtimeproducts', productController.getRealTimeProducts.bind(productController))
productsViewRouter.get('/product/:pid', productController.productDetail.bind(productController))

export default productsViewRouter