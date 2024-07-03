//auth sessions
export const authSessions = (req, res, next) => {
    if (!req.session.user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` })
    }
    next()
}
//auth jwt
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    if (!req.cookies["userCookie"]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` })
    }
    let token = req.cookies["userCookie"]
    console.log({ token })
    try {
        let user = jwt.verify(token, config.SECRET)
        req.user = user

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `${error}` })
    }
    next()
}
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
export const authorization = (permisos = []) => {
    return (req, res, next) => {
        permisos = permisos.map(p => p.toLowerCase())
        if (!req.user.rol) {
            res.setHeader('Content-Type', 'application/json');
            return CustomError.createError("Error de autorizacion", `No hay usuarios autenticados, o problema con el rol`, TIPOS_ERRORS.ERROR_AUTORIZACION)
        }
        const userRol = req.user.rol.toLowerCase();
        if (!permisos.includes(userRol)) {
            res.setHeader('Content-Type', 'application/json');
            return CustomError.createError("Error de autorizacion", `Privilegios insuficientes para acceder al recurso`, TIPOS_ERRORS.ERROR_AUTENTICACION)
        }
        return next()
    }
}