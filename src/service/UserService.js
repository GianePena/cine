
import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"
import { generaHash } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
import mongoose from "mongoose";
import { config } from "../config/config.js";
class UserService {
    constructor(dao) {
        this.dao = dao
    }
    getAllUsers = async () => {
        return this.dao.getUsers()
    }
    getUsersActive = async () => {
        let users = await this.getAllUsers()
        const date = new Date();
        date.setDate(date.getDate() - 2)
        for (let user of users) {
            if (!user.last_conection) {
                continue;
            }
            const lastConectionDate = new Date(user.last_conection);
            if (lastConectionDate < date) {
                user.status = "inactive"
                await this.dao.updateUser(user)
            }
            if (user.status === "inactive" && lastConectionDate >= date) {
                user.status = "active"
                await this.dao.updateUser(user)
            }
        }
        return this.dao.getUsers({ status: "active" })
    }
    getUserById = async (uid) => {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            throw new CustomError(
                "Error al encontrar usuario",
                `ID ${uid} no es un ObjectId válido`,
                TIPOS_ERRORS.BAD_REQUEST
            );
        }
        let user = await this.dao.getUserById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`)
            return CustomError.createError(
                "Error al encontrar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        return user
    }
    getBy = async (filtro) => {
        return this.dao.getBy(filtro)
    }
    createUser = async (user) => {
        return this.dao.createUser(user)
    }
    updateUserRol = async (uid) => {
        const user = await this.dao.getUserById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`);
            return CustomError.createError(
                "Error al eliminar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let identificacion = false
        let comprobanteDomicilio = false
        let comprobanteDeEstadoDeCuenta = false
        for (let documento of user.documents) {
            if (documento.type === "DNI") {
                identificacion = true
            }
            if (documento.type === "DOMICILIO") {
                comprobanteDomicilio = true
            }
            if (documento.type === "ESTADO_CUENTA") {
                comprobanteDeEstadoDeCuenta = true
            }
        }
        if (identificacion === true && comprobanteDomicilio === true && comprobanteDeEstadoDeCuenta === true) {
            user.rol = "premium"
        }
        else {
            return res.status(400).json({ message: "Usuario con documentos insuficientes" });
        }
        await this.dao.updateUser(user)
        return user
    }
    updateUserPassword = async (email, password) => {
        let user = await this.dao.getUserBy({ email: email })
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar la password", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (user.password === password) {
            return CustomError.createError(
                "Error contraseña ya utilizada ", `Introduzca una nueva contraseña`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
            );
        }
        user.password = generaHash(password);
        let updateUser = this.dao.updateUser(user)
        return updateUser
    }
    deleteUser = async (uid) => {
        const user = await this.dao.getUserById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`);
            return CustomError.createError(
                "Error al eliminar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        await this.dao.delete(user);
        return { message: `Usuario con id ${uid} eliminado correctamente` };
    }
    lastConection = async (uid, logout) => {
        const user = await this.dao.getUserById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`);
            return CustomError.createError(
                "Error al encontrar el usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        user.last_conection = logout
        console.log(user)
        await this.dao.updateUser(user)
        return user
    }
    documentationUpload = async (uid, files) => {
        const user = await this.dao.getUserById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`);
            return CustomError.createError(
                "Error al encontrar el usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        for (let file of files) {
            let filename = file.filename
            let path = file.path
            let type = file.type
            user.documents.push({ name: filename, reference: path, type: type })
        }
        await this.dao.updateUser(user)
        await this.updateUserRol(user)
        return user
    }
}

export const userService = new UserService(new UserManager())
