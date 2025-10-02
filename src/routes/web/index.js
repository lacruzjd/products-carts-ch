import express from 'express'
import productsViewRouter from './productsViewRouter.js'
import cartViewRoutes from './cartViewRouter.js'

const webRoutes = express.Router()

webRoutes.use('/', productsViewRouter)
webRoutes.use('/carts', cartViewRoutes)

export default webRoutes