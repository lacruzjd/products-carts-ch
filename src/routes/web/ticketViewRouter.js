import { Router } from "express";
import { auth } from "../../middlerwares/auth.js";
import TicketService from "../../services/ticketService.js";
import UserService from "../../services/UserService.js";
import UserMongoDAO from "../../dao/mongo/UserMongoDAO.js";
import UserDto from "../../dto/UserDTO.js";
import { createToken } from "../../utils/jwtUtils.js";


const router = Router()

router.get('/', auth, async (req, res) => {
    const user = req.user
    const userlog = await new UserService(new UserMongoDAO()).getUserById(user.id)
    const userdao = new UserDto(userlog)

    let token = createToken({ ...userdao }, '24h')

    res.cookie('authCookie', token, {

        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    })

    const ticket = await new TicketService().createTicket(user.cart, user.id)
    res.render('ticket', { title: 'Ticket', ticket })
})

export default router