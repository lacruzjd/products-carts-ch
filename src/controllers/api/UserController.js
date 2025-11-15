export default class UserController {
    constructor(userService) {
        this.service = userService
    }

    async addUser(req, res) {
        try {
            if (req.authError) return res.status(404).send({ error: req.authError })

            res.status(201).send({ user: req.user })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const { email } = req.params
            await this.service.deleteUser(email)
            res.status(200).send({ message: 'Usuario eliminado exitosamente' })
            res.clearCookie('authCookie')
            res.clearCookie('connect.sid')
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error al eliminar la sesion:', err)
                }
            })

        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }

    async updateUser(req, res) {
        try {
            const { email } = req.params
            const data = req.body
            const userUpdated = await this.service.updateUser(email, data)
            res.status(200).send({ message: 'Usuario actualizado exitosamente', user: userUpdated })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }



}