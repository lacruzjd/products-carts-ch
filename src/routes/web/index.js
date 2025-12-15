import express from 'express'
import productsViewRouter from './productsViewRouter.js'
import cartViewRoutes from './cartViewRouter.js'
import usersViewRouter from './usersViewRouter.js'
import router from './ticketViewRouter.js'

const webRoutes = express.Router()

webRoutes.use('/', productsViewRouter)
webRoutes.use('/carts', cartViewRoutes)
webRoutes.use('/users', usersViewRouter)
webRoutes.use('/tickets', router)

export default webRoutes