import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";
export const auth = (req, res, next) => {
    if (!req.cookies["userCookie"]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `No existen usuarios autenticados` })
    }
    let token = req.cookies["userCookie"]
    logger.info({ token })
    try {
        let user = jwt.verify(token, config.SECRET)
        req.user = user
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `${error}` })
    }
    next()
}

