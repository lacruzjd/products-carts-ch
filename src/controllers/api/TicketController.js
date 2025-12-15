import { createToken } from "../../utils/jwtUtils.js"
import UserService from "../../services/UserService.js"
import UserMongoDao from "../../dao/mongo/UserMongoDao.js"
import UserDto from "../../dto/UserDTO.js"

export default class TicketController {
    constructor(ticketService) {
        this.service = ticketService
    }

    async getTikets(req, res) {
        try {
            const tickets = await this.service.getTickets()
            res.status(200).json(tickets)
        } catch (error) {
            res.status(500).json({ status: 'Error', message: error.message })
        }
    }

    async getTicketById(req, res) {
        try {
            const { tid } = req.params
            const tiket = await this.service.getTiketById(tid)
            res.status(200).json(tiket)
        } catch (error) {
            res.status(404).json({ status: 'Error', message: error.message })
        }
    }

    async createTicket(req, res) {
        try {
            const user = req.user
            if (!user.cart) {
                return res.status(400).json({ error: "No hay carrito para generar el ticket." })
            }
            const ticket = await this.service.createTicket(user.cart, user.id)

            if (ticket) {
                const userlog = await new UserService(new UserMongoDao()).getUserById(user.id)
                const userdao = new UserDto(userlog)

                let token = createToken({ ...userdao }, '24h')

                res.cookie('authCookie', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'strict'
                })
            }
            res.status(201).json({ status: 'Success', data: ticket })
        } catch (error) {
            res.status(404).json({ status: 'Error', message: error.message })
        }
    }

}