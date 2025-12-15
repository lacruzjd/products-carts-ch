import { Router } from "express"
import UserManager from '../../dao/mongo/UserMongoDAO.js'
import UserService from '../../services/UserService.js'
import UserController from '../../controllers/api/UserController.js'
import { auth, authUpdate } from "../../middlerwares/auth.js"

const userManager = new UserManager()
const userService = new UserService(userManager)
const userController = new UserController(userService)

const usersRouter = Router()

usersRouter.get('/login', (req, res) => {
    const { err } = req.query

    if (err) {
        res.render('login', { err: err })

    } else {
        res.render('login', { title: 'Login' })
    }
})

usersRouter.get('/current', auth, (req, res) => {
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
usersRouter.get('/login/register', (req, res) => {
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

usersRouter.post('/register', userController.register.bind(userController))

usersRouter.get('/recoverpassemail', (req, res) => {
    try {
        res.render('recoverpassemail', { title: 'Recuperacion Contraseña', err: req.query.err })
    } catch (error) {
        res.render('recoverpassemail', { err: req.query.err })
    }
})

usersRouter.get('/recover-password', (req, res) => {
    try {
        const { token } = req.query
        if(!token) throw new Error("Token inválido o expirado")
        res.render('recover', { title: 'Recuperacion', token: token })

    } catch (error) {
        res.render('recover-password', { err: err })
    }
})

usersRouter.get('/update-user', authUpdate, (req, res) => {
    res.render('updateUser', { title: 'Actualizar Usuario', user: req.user})
})

export default usersRouter