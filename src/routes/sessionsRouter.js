import { Router } from "express";
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger.js";
import passport from "passport";
import { config } from "../config/config.js";
import { userDTO } from "../DTO/UserDTO.js";




export const router = Router()


router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return CustomError.createError(`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, `Fallo al autenticar`, TIPOS_ERRORS.ERROR_SERVIDOR_INTERNO)
})

router.get('/github', passport.authenticate("github", {}), (req, res) => { });

router.get('/callbackGithub', passport.authenticate("github", { session: false }), (req, res) => {
    const token = req.user.token
    if (!token) {
        return CustomError.createError("Autenticación fallida", `Token vacio o no proporcionado`, TIPOS_ERRORS.ERROR_AUTENTICACION)
    }
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(200).json(new userDTO(req.user))
});

router.post("/register", passport.authenticate("registro", { session: false }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    res.status(200).json(new userDTO(user))
})

router.post("/login", passport.authenticate("login", { session: false }),
    async (req, res) => {
        let user = req.user
        delete user.password;
        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("userCookie", token, { httpOnly: true })
        logger.info(token)
        res.status(200).json(user)
    }
)