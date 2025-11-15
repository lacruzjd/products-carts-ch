import { Router } from "express"
import passport from "passport"

import userModel from '../../models/userModel.js'
import UserManager from '../../managers/UserManager.js'
import UserService from '../../services/UserService.js'
import SessionsController from "../../controllers/api/SessionsController.js"

const userManager = new UserManager(userModel)
const userService = new UserService(userManager)
const sessionsController = new SessionsController(userService)

const seccionsRouter = Router()

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)
        if (!user) res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
        req.user = user
        next()
    })(req, res, next)
}

seccionsRouter.post('/login', sessionsController.login.bind(sessionsController))
seccionsRouter.get('/logout', sessionsController.logout.bind(sessionsController))
seccionsRouter.get('/current', jwtAuth, sessionsController.current.bind(sessionsController))

export default seccionsRouter