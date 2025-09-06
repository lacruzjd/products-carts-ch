import express from 'express'
import viewRoutes from './views.js'

const webRoutes = express.Router()

webRoutes.use('/', viewRoutes)

export default webRoutes