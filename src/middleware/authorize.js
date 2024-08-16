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
