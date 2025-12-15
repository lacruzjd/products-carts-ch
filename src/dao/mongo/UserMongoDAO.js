import MongoDAO from './MongoDAO.js'
import UserModel from '../../models/mongoose/UserModel.js'

export default class UserMongoDAO extends MongoDAO {
    constructor() {
        super(UserModel)
        this.model = UserModel
    }

    async createUser(newUser) {
        try {
            return await this.model.create(newUser)
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('DUPLICATE_EMAIL')
            }
            throw error
        }
    }

    async getUsers() {
        return await this.getAll()
    }

    async getUserById(uid) {
        return await this.getBy({ _id: uid })
    }

    async getUserByEmail(email) {
        return await this.getBy({ email })
    }

    async updateUser(uid, data) {
        return await this.update(uid, data)
    }

    async updatePassword(uid, newPassword) {
        return await this.update(uid, { password: newPassword })
    }
}