import { isValidPassword } from '../../utils/passwordUtils.js'
import { createToken, verifyToken } from '../../utils/jwtUtils.js'
import UserDto from '../../dto/UserDTO.js'

export default class SessionsController {
    constructor(service) {
        this.service = service
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await this.service.getUserByEmail(email)
            const validpass = await isValidPassword(password, user.password)

            if (!validpass) {
                throw new Error('Datos incorrectos')
            }
            
            const userDto = new UserDto(user)
            
            const anonymousCartId = req.cookies.cartId
            
            if(anonymousCartId) {
                const cartId = verifyToken(anonymousCartId)
                userDto.cart = cartId.cartId
                res.clearCookie('cartId')
            }
                     
            let token = createToken({...userDto}, '24h')

            res.cookie('authCookie', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict'
            })
                .json({ message: 'Login exitoso'})

        } catch (error) {
            res.status(404).json({ error: 'Datos incorrectos', message: error.message })
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

            res.status(200).json({ message: 'Sesión cerrada exitosamente.' })
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error al cerrar la sesión.' })
        }
    }

    current(req, res) {
        try {
            res.status(200).json({ user: req.user })
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error.', error: error.message})
        }
    }
}