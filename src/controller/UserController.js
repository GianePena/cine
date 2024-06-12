import { userService } from "../service/UserService.js"

export class UserController {
    static getUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers()
            res.status(200).json({ users })
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getUserBy = async (req, res) => {
        const { id } = req.params
        try {
            let user = await userService.getUserById(id)
            if (!user) {
                console.log(`Usuario con ID ${id} no encontrado`);
                res.status(404).json({ message: "usuario no encontrado" })
            }
            res.status(200).json({ user })
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getData = (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ user: req.user });
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static updateUserCart = async (req, res) => {
        const { cid } = req.body
        const { uid } = req.params
        try {
            const updateUser = await userService.updateUserCart(uid, cid)
            res.status(201).json({ updateUser });
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static deleteUser = async (req, res) => {
        const { id } = req.params
        try {
            const deleteUser = await userService.deleteUser(id)
            res.status(204).json({ deleteUser })
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
}


