import UserDto from '../../dto/UserDTO.js';
import { createToken, generarTokenRecuperacion1H, verifyToken } from '../../utils/jwtUtils.js';

export default class UserController {
    constructor(userService) {
        this.service = userService
    }

    async register(req, res) {
        try {
            const { first_name, last_name, email, password, rol } = req.body
            if (!email || !password || !first_name || !last_name) {
                return res.status(400).json({ status: 'Error', message: 'Todos los campos son obligatorios.' })
            }

            const user = await this.service.register(req.body)
            return res.status(201).json({ status: 'Success', data: user })
        } catch (error) {
            return res.status(500).json({ status: 'Error', message: error.message })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await this.service.getUsers()
            return res.status(200).json({ status: 'success', data: users })
        } catch (error) {
            res.status(401).json({ status: 'error', message: 'Error al obtener usuarios.' })
        }
    }

    async deleteUser(req, res) {
        try {
            const { uid } = req.params
            if (!uid) throw new Error('Se requiere el id del usuario')
            if (uid !== req.user.id) throw new Error('No se puede eliminar usuario, id no coincide')
            await this.service.deleteUser(uid)

            res.clearCookie('authCookie')
            res.clearCookie('connect.sid')
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error al eliminar la sesion:', err)
                }
            })

            res.status(201).json({ message: 'Usuario eliminado exitosamente' })
        } catch (error) {
            res.status(401).json({ status: 'Error', message: error.message })
        }
    }

    async updateUser(req, res) {
        try {
            console.log(req.user)
            const { uid } = req.params
            if (!uid) throw new Error('Se requiere el id del usuario')
            if (uid !== req.user.id) throw new Error('No se puede actualizar usuario, id invalido')
            const data = req.body
            const userUpdated = await this.service.updateUser(req.user.id, data)

            res.clearCookie('authCookie')
            res.clearCookie('connect.sid')
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error al eliminar la sesion:', err)
                }
            })

            let token = createToken({...userUpdated}, '24h')
            res.cookie('authCookie', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict'
            })

            res.status(200).json({ status: 'Usuario actualizado exitosamente', data: userUpdated })

        } catch (error) {
            res.status(400).json({ status: 'Error', message: error.message })
        }
    }

    async currentUser(req, res) {
        try {
            res.status(200).send({ message: 'Usuario', user: req.user })
        } catch (error) {
            res.status(400).send({ status: 'Error', message: error.message })
        }
    }

    async recoverPasswordEmail(req, res) {
        try {
            const { email } = req.body
            if (!email) throw new Error('Se requiere el email del usuario')
            const user = await this.service.getUserByEmail(email); // Validar que el usuario existe
            // Crear un token de recuperación que expira en 1 hora
            const currentDate = new Date()
            const token = generarTokenRecuperacion1H(user._id, currentDate)

            // Construir el enlace de recuperación
            const recoveryLink = `http://localhost:8080/users/recover-password?token=${token}`;

            await this.service.recoverPasswordEmail(email, recoveryLink)
            res.status(201).json({ mensaje: 'Se envio email con instrucciones para la recuperación de contraseña' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async recoverPassword(req, res) {
        try {
            const { password, token } = req.body
            if (!password) throw new Error('Se requiere la contraseña')
            if (!token) throw new Error('Se requiere el token')

            const decoded = verifyToken(token)
            if (decoded) {
                await this.service.recoverPassword(decoded.sub, password)
            }

            res.status(200).json({ mensaje: 'Contraseña restablecida' })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
}