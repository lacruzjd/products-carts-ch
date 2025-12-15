import UserDto from '../dto/UserDTO.js'
import User from '../entities/User.js'
import { createHash, isValidPassword } from '../utils/passwordUtils.js'
import sendEmail from '../config/nodemailerConfig.js'

export default class UserService {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async register(userData) {
        try {
            userData.password = createHash(userData.password)

            const newUserEntity = new User(userData)
            const userSaved = await this.userDao.createUser(newUserEntity)

            return new UserDto(userSaved)
        } catch (error) {
            if (error.message === 'DUPLICATE_EMAIL') {
                throw new Error('Ya hay un usuario registrado con ese email')
            }
            throw new Error(error)
        }
    }

    async getUsers() {
        try {
            const users = await this.userDao.getUsers()
            return users.map(user => new UserDto(user))
        } catch (error) {
            throw error
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userDao.getUserByEmail(email)
            if (!user) throw new Error("Usuario no Encontrado")
            return user
        } catch (error) {
            throw error
        }
    }

    async getUserById(uid) {
        try {
            if (!uid) throw new Error('Se requiere el id del usuario')
            const user = await this.userDao.getUserById(uid)
            if (!user) throw new Error("Usuario no Encontrado")
            return user
        } catch (error) {
            throw error
        }
    }

    async updateUser(uid, data) {
        try {
            if (!uid) throw new Error('Se requiere el email del usuario')
            const user = await this.userDao.getUserById(uid);
            if (!user) throw new Error('Usuario no encontrado')
            const userUpdated = await this.userDao.updateUser(uid, data);
            return new UserDto(userUpdated)
        } catch (error) {
            throw error
        }
    }

    async deleteUser(uid) {
        try {
            if (!uid) throw new Error('Se requiere el email del usuario')
            const user = await this.userDao.getUserById(uid);
            if (!user) throw new Error('Usuario no encontrado')
            await this.userDao.delete(uid);
        } catch (error) {
            throw error
        }
    }

    async recoverPassword(uid, password) {
        try {
            if (!uid) throw new Error('Se requiere id del usuario')
            const user = await this.userDao.getById(uid)
            const newHashedPassword = createHash(password)

            if (!user) throw new Error('Usuario no encontrado')

            if (await isValidPassword(password, user.password)) {
                throw new Error('No puede restablecer la contraseña a la misma que tenía anteriormente')
            }

            await this.userDao.updatePassword(user._id, newHashedPassword)

        } catch (error) {
            throw error
        }
    }

    async recoverPasswordEmail(email, linkrecover) {
        try {
            if (!email) throw new Error('Se requiere el email del usuario')
            const user = await this.userDao.getUserByEmail(email);
            if (!user) throw new Error('Usuario no encontrado')

            await sendEmail(
                {
                    from: "lacruzjosedavid@gmail.com",
                    to: user.email,
                    subject: "Recupera tu contraseña",
                    // Usamos HTML para poder crear un botón/enlace más atractivo
                    text: `
                    Hola, Solicitaste recuperar tu contraseña. Usa el siguiente enlace para crear una nueva:

                    ${linkrecover}

                    Este enlace es válido por un tiempo limitado. Si no fuiste tú, simplemente ignora este correo.
                    `
                }
            )

        } catch (error) {
            throw error

        }

    }
}