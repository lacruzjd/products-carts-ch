import {Router} from 'express'
import { register } from '../../controllers/web/registrer.constroller.js'
import { login } from '../../controllers/web/login.controller.js'

const userRoutes = Router()

userRoutes.post('/registro', register)
userRoutes.post('/login', login)

export default userRoutes