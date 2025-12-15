import { Router } from 'express'
import { config } from '../../config/config.js'
import StorageService from '../../services/StorageService.js'

import ProductManager from '../../dao/mongo/ProductMongoDAO.js'
import ProductService from '../../services/ProductService.js'
import ProductsViewController from '../../controllers/web/productsViewController.js'

import CartManager from '../../dao/mongo/CartMongoDAO.js'
import CartService from '../../services/CartService.js'

import { auth, current } from '../../middlerwares/auth.js'


const productManager = new ProductManager()
const cartManager = new CartManager()
const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService(productManager, storageImagenes)
const cartService = new CartService(cartManager, productManager)
const productController = new ProductsViewController(productService, cartService)

const productsViewRouter = Router()
productsViewRouter.get('/', current, productController.getProducts.bind(productController))
productsViewRouter.get('/realtimeproducts', productController.getRealTimeProducts.bind(productController))
productsViewRouter.get('/product/:pid', productController.productDetail.bind(productController))

export default productsViewRouter