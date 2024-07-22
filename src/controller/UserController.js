import { userDTO } from "../DTO/UserDTO.js"
import { userService } from "../service/UserService.js"

export class UserController {
    static getUsers = async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            const usersDto = users.map(u => new userDTO(u))
            res.status(200).json(usersDto)
        } catch (error) {
            req.logger.error(`Error fetching all users: ${error.message}`)
            next(error)
        }
    }
    static getBy = async (req, res, next) => {
        const { id } = req.params
        try {
            let user = await userService.getUserById(id)
            res.status(200).json(new userDTO(user))
        } catch (error) {
            req.logger.error(`Error fetching users by ${id}: ${error.message}`)
            next(error)
        }
    }
    static getData = (req, res, next) => {
        try {
            let user = new userDTO(req.user)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ user });
        } catch (error) {
            req.logger.error(`Error al obtener la data del user: ${error.message}`)
            next(error)
        }
    }
    static updateRol = async (req, res, next) => {
        const { uid } = req.params
        const { rol } = req.body
        try {
            if (!['user', 'premium'].includes(rol)) {
                return res.status(400).json({ error: 'Rol inválido' });
            }
            const updatedRol = await userService.updateUserRol(uid, rol)
            res.status(200).json(updatedRol)
        } catch (error) {
            req.logger.error(`Error al modificar los datos del user: ${error.message}`)
            next(error)
        }
    }
    static updateUserCart = async (req, res, next) => {
        const { cid } = req.body
        const { uid } = req.params
        try {
            const updateUser = await userService.updateUserCart(uid, cid)
            res.status(201).json(updateUser);
        } catch (error) {
            req.logger.error(`Error al modificar los datos del user: ${error.message}`)
            next(error)
        }
    }
    static deleteUser = async (req, res, next) => {
        const { id } = req.params
        try {
            const deleteUser = await userService.deleteUser(id)
            res.status(204).json({ message: "Usuario eliminado con exito" })
            req.info(`Usuario ${id}: ELIMINADO CON EXITO`)
        } catch (error) {
            req.logger.error(`Error al elimianr el usuario ${id}: ${error.message}`)
            next(error)
        }
    }
}


