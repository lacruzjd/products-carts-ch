import { Router } from "express"
import UserMongoDAO from "../../dao/mongo/UserMongoDAO.js"
import UserService from '../../services/UserService.js'
import SessionsController from "../../controllers/api/SessionsController.js"
import { auth } from "../../middlerwares/auth.js"

const userMongoDAO = new UserMongoDAO()
const userService = new UserService(userMongoDAO)
const sessionsController = new SessionsController(userService)

const seccionsRouter = Router()

seccionsRouter.post('/login', sessionsController.login.bind(sessionsController))
seccionsRouter.get('/logout', sessionsController.logout.bind(sessionsController))
seccionsRouter.get('/current', auth, sessionsController.current.bind(sessionsController))

export default seccionsRouter