import { userDTO } from "../DTO/UserDTO.js"
import { userService } from "../service/UserService.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js"

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
                req.logger.warn(`Datos ingresados: rol: ${rol}  y  id del usuario ${uid}`)
                return CustomError.createError("Error en la modificacion del producto", "Caracteres validos: user y premium", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const updatedRol = await userService.updateUserRol(uid, rol)
            let user = await userService.getUserById(uid)
            req.logger.info(`Rol del usario modificado correctamente ${user}`)
            res.status(200).json(user)
        } catch (error) {
            req.logger.error(`Error al modificar los datos del user: ${error.message}`)
            next(error)
        }
    }
    static updatePassword = async (req, res, next) => {
        const { code, email, password } = req.body
        try {
            const codeCookie = req.cookies.codigoRecuperacionContraseña;
            if (!code || !codeCookie || code !== codeCookie) {
                req.logger.error(`Error al modificar los datos del user: codigo incompatible para ectualizar password `);
                return CustomError.createError("Codigo incorrecto", "El codigo ingresado no coincide con el enviado", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const newPassword = await userService.updateUserPassword(email, password)
            res.status(201).json(`Contraseña actualizada`);
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


