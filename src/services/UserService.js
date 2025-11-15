import User from '../entities/User.js'
import { createHash } from '../utils/passwordUtils.js'

export default class UserService {
    constructor(userManager) {
        this.userManager = userManager
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData)
            newUser.password = createHash(userData.password)
            newUser.cart = ''

            const userSaved = await this.userManager.save(newUser)
            return new User(userSaved)
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Ya hay un usuario registrado con ese email');
            }
            console.log(error)
            throw new Error("No se pudo gardar el usuario debido a un error interno")
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userManager.getUserByEmail(email)
            if (!user) throw new Error("Usuario no Encontrado")
            return user
        } catch (error) {
            throw error
        }
    }

    async updateUser(email, data) {
        try {
            if (!email) throw new Error('Se requiere el email del usuario')
            const user = await this.userManager.getUserByEmail({email})
            if (!user) throw new Error('Usuario no encontrado')
            const uid = user._id.toString()
            if (data.password) data.password = createHash(data.password)
            
            const userUpdated = await this.userManager.update(uid, data)
            return new User(userUpdated)
        } catch (error) {
            throw error
        }
    }

    async deleteUser(email) {
        try {
            if (!email) throw new Error('Se requiere el email del usuario')
            const user = await this.userManager.getUserByEmail({email})
            if (!user) throw new Error('Usuario no encontrado')
            const uid = user._id.toString()
            await this.userManager.delete(uid)
        } catch (error) {
            throw error

        }
    }
}