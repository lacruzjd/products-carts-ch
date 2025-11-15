import Router from 'express'
import UserModel from '../../models/userModel.js'
import UserManager from '../../managers/UserManager.js'
import UserService from '../../services/UserService.js'
import UserController from '../../controllers/api/UserController.js'

import passport from 'passport'

const userManager = new UserManager(UserModel)
const userService = new UserService(userManager)
const userController = new UserController(userService)

const usersRouter = Router()

const handleRegister = (req, res, next) => {
  passport.authenticate('register', (error, user, info) => {
    if (error) {
      // Pasar el error al siguiente middleware
      req.authError = error.message;
      next();
    }
    
    if (!user) {
      // Pasar el mensaje de info al siguiente middleware
      req.authError = info?.message || 'Error de registro';
      next()
    }

    req.user = user 
    next()

  })(req, res, next);
};

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)
        if (!user) res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
        req.user = user
        next()
    })(req, res, next)
}

usersRouter.post('/', handleRegister, userController.addUser.bind(userController))
usersRouter.delete('/:email', jwtAuth, userController.deleteUser.bind(userController))
usersRouter.put('/:email', jwtAuth, userController.updateUser.bind(userController))
 
export default usersRouter