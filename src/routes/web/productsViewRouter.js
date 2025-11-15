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

import passport from 'passport'

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)
        req.user = user
        next()
    })(req, res, next)
}

const jwtAuthAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)
        if (!user || user.role !== 'admin') res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
        req.user = user
        next()
    })(req, res, next)
}

const productManager = new ProductManager(ProductModel)
const cartManager = new CartManager(CartModel)
const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService(productManager, storageImagenes)
const cartService = new CartService(cartManager, productManager)
const productController = new ProductsViewController(productService, cartService)

const productsViewRouter = Router()
productsViewRouter.get('/', jwtAuth, productController.getProducts.bind(productController))
productsViewRouter.get('/realtimeproducts', jwtAuthAdmin, productController.getRealTimeProducts.bind(productController))
productsViewRouter.get('/product/:pid', productController.productDetail.bind(productController))

export default productsViewRouter