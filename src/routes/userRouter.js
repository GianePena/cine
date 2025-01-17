import { Router } from "express";
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger.js";
import passport from "passport";
import { passportCall } from "../utils/utils.js";
import { config } from "../config/config.js";
import { UserController } from "../controller/UserController.js";

import { authorization } from '../middleware/authorize.js';
import { usersGenerados } from "../DAO/mocking/mocks.js";

import { sendCodeRouter } from "./sendCodeEmail.js";
import { userDTO } from "../DTO/UserDTO.js";
import { uploads } from "../middleware/multer.js";



export const router = Router()

router.use(sendCodeRouter)
router.get('/mockinguser', (req, res) => {
    res.status(200).json(usersGenerados)
    logger.info(`Usuarios mokcs:${usersGenerados}`)
})
/*
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
    res.status(200).json(`Usuario loggeado con Github: ${req.user.email}`)
});

router.post("/registro", passport.authenticate("registro", { session: false }), async (req, res) => {
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
)*/

router.get('/logout', passportCall("jwt"), authorization(["user", "premium", "admin"]), UserController.lastConection)

router.get("/data/:uid", UserController.getData)

router.get("/", UserController.getUsers)

router.get("/activeUsers", passportCall("jwt"), authorization(["admin"]), UserController.getActiveUsers)

router.get("/:uid", passportCall("jwt"), authorization(["user"]), UserController.getBy)

router.post("/updatePassword", UserController.updatePassword)
router.post("/:uid/documents", passportCall("jwt"), authorization(["user"]), uploads.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobante_de_domicilio', maxCount: 1 },
    { name: 'comprobante_de_estado_de_cuenta', maxCount: 1 }
]), UserController.documentationUpload)


router.delete("/:uid", UserController.deleteUser)







