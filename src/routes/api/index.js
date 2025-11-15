import express from 'express'
import productRouter from './productRouter.js'
import cartRouter from './cartRouter.js'
import usersRouter from './usersRouter.js'
import sessionsRouter from './sessionsRouter.js'

const apiRoutes = express.Router()

apiRoutes.use('/products', productRouter)
apiRoutes.use('/carts', cartRouter)
apiRoutes.use('/sessions', sessionsRouter)
apiRoutes.use('/users', usersRouter)

export default apiRoutes