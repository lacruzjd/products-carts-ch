import { Router } from 'express'
import { config } from '../../config/config.js'
import ProductModel from '../../models/productModel.js'
import ProductManager from '../../managers/ProductManager.js'
import ProductService from '../../services/ProductService.js'
import StorageService from '../../services/StorageService.js'
import ProductController from '../../controllers/api/productController.js'

const productManager = new ProductManager(ProductModel)
const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService(productManager, storageImagenes)
const productController = new ProductController(productService)

const productsRouter = Router()
productsRouter.get('/',  productController.getProducts.bind(productController))
productsRouter.get('/:pid', productController.getProductById.bind(productController))
productsRouter.post('/', productController.addProducts.bind(productController))
productsRouter.put('/:pid', productController.updateProduct.bind(productController))
productsRouter.delete('/:pid', productController.deleteProduct.bind(productController))

export default productsRouter