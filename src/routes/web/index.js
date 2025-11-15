import express from 'express'
import productsViewRouter from './productsViewRouter.js'
import cartViewRoutes from './cartViewRouter.js'
import usersViewRouter from './usersViewRouter.js'

const webRoutes = express.Router()

webRoutes.use('/', productsViewRouter)
webRoutes.use('/carts', cartViewRoutes)
webRoutes.use('/users', usersViewRouter)

export default webRoutes