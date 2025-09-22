import express from 'express'
import productRouter from './productRouter.js'
import cartRouter from './cartRouter.js'

const apiRoutes = express.Router()

apiRoutes.use('/products', productRouter)
apiRoutes.use('/carts', cartRouter)

export default apiRoutes