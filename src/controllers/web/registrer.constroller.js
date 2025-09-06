import UserManager from "../../managers/users.manager"

export const register = async (req, res) => {
    try {
        const userManager = new UserManager()
        await userManager.addUser(req.body)

        res.status(201).send('creado')
        
    } catch (error) {
        res.status(404).send(`Usuario no registrado: ${error.message}`)
    }
    
}