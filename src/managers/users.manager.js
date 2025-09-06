import { join } from 'path'
import { config } from '../config/config.js'
import { error } from 'console'
import User from '../models/User.js'
import { PasswordHasher } from '../services/PasswordHasher.js'
import { IdGenerator } from '../services/IdGenerator.js'
import { ReadWriteFile } from '../services/readWriteFile.js'

// Ruta para la persiencia de productos
const pathUsersData = join(config.paths.db, 'users.json')

// Funciones para obtener y persistir datos
const getData = async () => await ReadWriteFile.readFile(pathUsersData)
const saveData = async (users) => await ReadWriteFile.writeFIle(pathUsersData, users)

//Clase para gestionar los productos
class UserManager {
    constructor() {
        this.pathUsersData = pathUsersData
        this.users = []
    }

    async addUser(user) {
        try {
            this.users = await getData()

            if (this.users.some(u => u.email === user.email)) {
                throw new Error(`Email ya registrado.`)
            }

            user.id = IdGenerator.generate()
            user.password = PasswordHasher.hash(user.password)

            const newUser = new User(user)
            this.users.push(newUser)

            await saveData(this.users)

        } catch (error) {
            throw new Error(`Ocurrio un error al registrar usuario. ${error}`)
        } finally {
            this.users = []
        }
    }

    async getUserById(id) {
        try {
            this.users = await getData()
            const userById = this.users.find(u => u.id === id)

            if (!userById) throw new Error(`Not found`)

            return userById

        } catch (error) {
            throw new Error('Usuario no Registrado')
        } finally {
            this.users = []
        }
    }

    async updateUser(id, data) {
        try {
            this.user = await getData()
            const dataToUpdate = this.user.find(p => p.id === id)

            if (dataToUpdate) {
                Object.keys(await data).forEach(k => {
                    if (k !== dataToUpdate[k]) {
                        dataToUpdate[k] = data[k]
                    }
                })

                await saveData(this.users)
            } else {
                throw new Error(`Usuario no encontrado: ${error.message}`)
            }

        } catch (error) {
            throw new Error(error.message)
        } finally {
            this.users = []
        }
    }

    async deleteUser(id) {
        try {
            this.users = await getData()
            userToDelete = this.users.some(u => u.id === id)

            if (userToDelete) {
                this.users = this.users.filter(p => p.id !== id)
                await saveData(this.users)
            } else {
                throw new Error(`Producto no encontrado`)
            }
        } catch (error) {
            throw new Error(`Error al eliminar producto ${error} `)
        } finally {
            this.users = []
        }
    }

    async auntenticaUser(email, password) {
        try {
            this.users = await getData()
            const userById = this.users.find(u => u.email === email)

            if (userById) {
                const passHash = PasswordHasher.hash(password)

                if (passHash === userById.password) {
                    return true
                } else {
                    throw new Error('Clave no coincide')
                }

            } else {
                throw new Error('Usuario no encontrado')
            }

        } catch (error) {
            throw new Error(`Email o clave no coincide: ${error.message}`)
        } finally {
            this.users = []
        }
    }

}

export default UserManager