import { userDTO } from "../DTO/UserDTO.js"
import { userService } from "../service/UserService.js"

export class UserController {
    static getUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers()
            const usersDto = users.map(u => new userDTO(u))
            res.status(200).json(usersDto)
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getBy = async (req, res) => {
        const { id } = req.params
        try {
            let user = await userService.getUserById(id)
            res.status(200).json(new userDTO(user))
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getData = (req, res) => {
        try {
            let user = new userDTO(req.user)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ user });
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
            res.status(201).json(new userDTO(updateUser));
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static deleteUser = async (req, res) => {
        const { id } = req.params
        try {
            const deleteUser = await userService.deleteUser(id)
            res.status(204).json({ message: "Usuario eliminado con exito" })
        } catch (error) {
            console.error("Error fetching users: ", error)
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
}


