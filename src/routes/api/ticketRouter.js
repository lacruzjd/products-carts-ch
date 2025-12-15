import { Router } from 'express'
import TicketController from '../../controllers/api/ticketController.js'
import TicketMongoDAO from '../../dao/mongo/TicketMongoDAO.js'
import TicketService from '../../services/TicketService.js'
import { auth } from '../../middlerwares/auth.js'

const ticketService = new TicketService(new TicketMongoDAO())
const ticketController = new TicketController(ticketService)

const ticketRouter = Router()

ticketRouter.get('/', auth,  ticketController.createTicket.bind(ticketController))
ticketRouter.get('/:tid', auth, ticketController.getTicketById.bind(ticketController))

export default ticketRouter