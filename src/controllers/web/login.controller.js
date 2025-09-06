import UserManager from "../../managers/users.manager"

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const userManager = new UserManager()
        const response = await userManager.auntenticaUser(email, password)
       
        res.status(200).send(response)
        
    } catch (error) {
        
        res.status(404).send(`${error.message}`)
    }
}
