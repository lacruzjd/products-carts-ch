import Router from 'express'
import UserMongoDao from '../../dao/mongo/UserMongoDAO.js'
import UserService from '../../services/UserService.js'
import UserController from '../../controllers/api/UserController.js'
import {authUpdate, authAdmin} from '../../middlerwares/auth.js'


const usersRouter = Router()
const userService = new UserService(new UserMongoDao())
const userController = new UserController(userService)

usersRouter.get('/', authAdmin, userController.getUsers.bind(userController))
usersRouter.post('/', userController.register.bind(userController))
usersRouter.put('/:uid', authUpdate, userController.updateUser.bind(userController))
usersRouter.delete('/:uid', authUpdate, userController.deleteUser.bind(userController))
usersRouter.post('/recoverpasswordSendEmail', userController.recoverPasswordEmail.bind(userController))
usersRouter.post('/recoverpassword', userController.recoverPassword.bind(userController))

export default usersRouter