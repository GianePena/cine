//auth sessions
/*export const authSessions = (req, res, next) => {
    if (!req.session.user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` })
    }
    next()
}*/
//auth jwt
import jwt from "jsonwebtoken"
import { SECRET } from "../utils.js";
export const auth = (req, res, next) => {
    if (!req.cookies["userCookie"]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` })
    }
    let token = req.cookies["userCookie"]
    console.log({ token })
    try {
        let user = jwt.verify(token, SECRET)
        req.user = user

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `${error}` })
    }
    next()
}

export const authorization = (permisos = []) => {
    return (req, res, next) => {
        permisos = permisos.map(p => p.toLowerCase())
        if (permisos.includes("user")) {
            return next()
        }
        if (!req.user.rol) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `No hay usuarios autenticados, o problema con el rol` })
        }
        if (!permisos.includes(req.user.rol.toLowerCase())) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `Privilegios insuficientes para acceder al recurso` })
        }
        return next()
    }
}