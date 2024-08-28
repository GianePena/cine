
import { userDTO } from "../DTO/UserDTO.js"
import { userService } from "../service/UserService.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js"
import { config } from "../config/config.js"
import { logger } from "../utils/logger.js"
import jwt from 'jsonwebtoken';

export class UserController {
    static getUsers = async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            const usersDto = users.map(u => new userDTO(u));
            res.status(200).json(usersDto);
        } catch (error) {
            req.logger.error(`Error fetching all users: ${error.message}`);
            next(error);
        }
    }
    static getActiveUsers = async (req, res, next) => {
        try {
            const users = await userService.getUsersActive()
            const usersDto = users.map(u => new userDTO(u));
            res.status(200).json(usersDto);
        } catch (error) {
            req.logger.error(`Error fetching all users: ${error.message}`);
            next(error);
        }
    }
    static getBy = async (req, res, next) => {
        const { uid } = req.params
        try {
            const user = await userService.getUserById(uid);
            res.status(200).json(new userDTO(user))
        } catch (error) {
            req.logger.error(`Error al obtener users by ${uid}: ${error.message}`)
            next(error)
        }
    }
    static getData = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await userService.getUserById(uid);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(new userDTO(user));
        } catch (error) {
            req.logger.error(`Error al obtener la data del user: ${error.message}`)
            next(error)
        }
    }
    static updatePassword = async (req, res, next) => {
        const { code, email, password } = req.body;
        try {
            if (!code || code !== config.CODIGO_DE_RECURERACION_DE_PASSWORD) {
                req.logger.error(`Error al modificar los datos del user: codigo incompatible para actualizar password`);
                const error = CustomError.createError("Codigo incorrecto", "El codigo ingresado no coincide con el enviado", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS);
                return next(error);
            }
            await userService.updateUserPassword(email, password);
            res.status(201).json(`Contraseña del usuario: ${email} actualizada`)
        } catch (error) {
            req.logger.error(`Error al modificar los datos del user`);
            next(error);
        }
    };
    static deleteUser = async (req, res, next) => {
        const { uid } = req.params
        try {
            const deleteUser = await userService.deleteUser(uid)
            res.status(200).json(`Usuario ${uid} eliminado con exito`)
                ('Usuario eliminado con exito')
            req.logger.info(`Usuario cuyo id es ${uid}: ELIMINADO CON EXITO`)
        } catch (error) {
            req.logger.error(`Error al elimianr el usuario ${uid}`)
            next(error)
        }
    }
    static lastConection = async (req, res, next) => {
        try {
            let token = req.cookies.userCookie
            let getUser = jwt.verify(token, config.JWT_SECRET)
            let uid = getUser._id
            res.clearCookie("userCookie")
            const date = new Date();
            await userService.lastConection(uid, date);
            res.status(200).json(`User ${getUser.email} logout`)
        } catch (error) {
            req.logger.error(`ERROR AL REALIZARL EL LOGOUT`)
            next(error)
        }
    }
    static documentationUpload = async (req, res, next) => {
        try {
            let token = req.cookies.userCookie
            let getUser = jwt.verify(token, config.JWT_SECRET)
            let uid = getUser._id
            let { identificacion, comprobante_de_domicilio, comprobante_de_estado_de_cuenta } = req.files
            if (!identificacion || !comprobante_de_domicilio || !comprobante_de_estado_de_cuenta) {
                return CustomError.createError("Error en la carga de documentos", `Documentacion incompleta`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            let files = [
                {
                    filename: identificacion[0].filename,
                    path: identificacion[0].path,
                    type: "DNI"
                },
                {
                    filename: comprobante_de_domicilio[0].filename,
                    path: comprobante_de_domicilio[0].path,
                    type: "DOMICILIO"
                },
                {
                    filename: comprobante_de_estado_de_cuenta[0].filename,
                    path: comprobante_de_estado_de_cuenta[0].path,
                    type: "ESTADO_CUENTA"
                }
            ]
            await userService.documentationUpload(uid, files)
            res.status(200).json(`Documentacion cargada: user ${getUser.email}`)
        } catch (error) {
            next(error)
        }
    }
}
