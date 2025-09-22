import express from 'express'
import viewRoutes from './viewRouter.js'

const webRoutes = express.Router()

webRoutes.use('/', viewRoutes)

export default webRoutes