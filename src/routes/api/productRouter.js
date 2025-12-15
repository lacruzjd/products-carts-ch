import { Router } from 'express'
import { config } from '../../config/config.js'
import ProductMongoDao from '../../dao/mongo/ProductMongoDAO.js'
import ProductService from '../../services/ProductService.js'
import StorageService from '../../services/StorageService.js'
import ProductController from '../../controllers/api/productController.js'
import {authAdmin} from '../../middlerwares/auth.js'

const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService( new ProductMongoDao(), storageImagenes)
const productController = new ProductController(productService)

const productsRouter = Router()
productsRouter.get('/',  productController.getProducts.bind(productController))
productsRouter.get('/:pid', productController.getProductById.bind(productController))
productsRouter.post('/', authAdmin, productController.addProducts.bind(productController))
productsRouter.put('/:pid', authAdmin, productController.updateProduct.bind(productController))
productsRouter.delete('/:pid', authAdmin, productController.deleteProduct.bind(productController))

export default productsRouter