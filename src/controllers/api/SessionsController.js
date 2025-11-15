import User from '../../entities/User.js'

import { isValidPassword } from '../../utils/passwordUtils.js'
import { createToken } from '../../utils/jwtUtils.js'

export default class SessionsController {
    constructor(service) {
        this.service = service
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await this.service.getUserByEmail({ email })
            const validpass = await isValidPassword(password, user.password)

            if (!validpass) {
                throw new Error('Datos inconrrectos')
            }

            let token = createToken(new User(user), '24h')

            res.cookie('authCookie', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict'
                
            })
                .send({ message: 'Login exitoso' })

        } catch (error) {
            res.status(404).send({ error: 'Datos incorrectos', message: error.message })
        }
    }

    logout(req, res) {
        try {
            res.clearCookie('authCookie')
            res.clearCookie('connect.sid')
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error al eliminar la sesion:', err)
                }
            })

            res.status(200).send({ message: 'Sesión cerrada exitosamente.' })
        } catch (error) {
            res.status(500).send({ message: 'Ocurrió un error al cerrar la sesión.' })
        }
    }

    current(req, res) {
        res.status(200).send({ user: req.user })
    }
}