import Manager from './Manager.js'

export default class UserManager extends Manager {
    constructor(model) {
        super(model)
    }

    async getUserByEmail(email) {
        try {
            return await this.getBy(email)
        } catch (error) {
            throw new Error('Usuario no encontrado', error.message)
        }
    }

    async getUserById(uid) {
        try {
            return await this.getBy(uid)
        } catch (error) {
            throw new Error('Usuario no encontrado', error.message)
        }
    }
}