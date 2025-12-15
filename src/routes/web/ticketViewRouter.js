import { Router } from "express";
import { auth } from "../../middlerwares/auth.js";
import TicketService from "../../services/ticketService.js";


const router = Router()

router.get('/', auth, async (req, res) => {
    const user = req.user
    const ticket = await new TicketService().createTicket(user.cart, user.id)
    console.log(ticket)
    res.render('ticket', { title: 'Ticket', ticket })
})


router.post('/', (req, res) => {
    const data = req.query

    res.render('ticket', { title: 'Ticket', ticket: data })
})

export default router