import express from 'express'
import { getProducts, getRealTimeProducts, productDetail } from '../../controllers/web/viewController.js'

const viewRoutes = express.Router()
viewRoutes.get('/', getProducts)
viewRoutes.get('/realtimeproducts', getRealTimeProducts)
viewRoutes.get('/product/:pid', productDetail)

export default viewRoutes


