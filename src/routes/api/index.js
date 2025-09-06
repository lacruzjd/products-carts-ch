import express from 'express'
import productsRouter from './products.router.js'
import cartsRouter from './carts.router.js'

const apiRoutes = express.Router()

apiRoutes.use('/products', productsRouter)
apiRoutes.use('/carts', cartsRouter)

export default apiRoutes