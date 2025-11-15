import { Router } from "express"
import UserModel from '../../models/userModel.js'
import UserManager from '../../managers/UserManager.js'
import UserService from '../../services/UserService.js'
import UserController from '../../controllers/api/UserController.js'
import passport from "passport"

const userManager = new UserManager(UserModel)
const userService = new UserService(userManager)
const userController = new UserController(userService)

const usersRouter = Router()

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!user) res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
        req.user = user
        next()
    })(req, res, next)
}

usersRouter.get('/login', (req, res) => {
    const { err } = req.query

    if (err) {
        res.render('login', { err: err })

    } else {
        res.render('login', { title: 'Login' })
    }
})

usersRouter.get('/current', jwtAuth, (req, res) => {
    res.render('current', {
        title: 'Perfil Usuario',
        ...req.user
    })
})

usersRouter.get('/register', (req, res) => {
    const { err } = req.query

    if (err) {
        res.render('register', { err: err })
    } else {
        res.render('register', { title: 'Registro' })
    }
})

usersRouter.get('/logout', (req, res) => {
    res.clearCookie('authCookie')
    res.clearCookie('connect.sid')
    req.session.destroy((err) => {
        if (err) {
            console.log('Error al eliminar la sesion:', err)
        }
    })
    res.redirect('/')
})

usersRouter.post('/register', userController.addUser.bind(userController))

export default usersRouter