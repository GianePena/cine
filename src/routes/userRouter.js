import { Router } from "express";
import passport from "passport";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import { UserController } from "../controller/UserController.js";
import { passportCall } from "../utils/utils.js";

import { authorization } from "../middleware/auth.js"
import { usersGenerados } from "../DAO/mocking/mocks.js";
import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js";
import { sendCodeRouter } from "./sendCodeEmail.js";
const userManager = new UserManager();
export const router = Router()


router.get('/mockinguser', (req, res) => {
    res.status(200).json(usersGenerados)
    logger.info(`Usuarios mokcs:${usersGenerados}`)
})
router.use(sendCodeRouter)

//app.use("/user", userRouter)

router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return CustomError.createError(`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, `Fallo al autenticar`, TIPOS_ERRORS.ERROR_SERVIDOR_INTERNO)
})


//PASSPORT GITHUB
router.get('/github', passport.authenticate("github", {}), (req, res) => { });

router.get('/callbackGithub', passport.authenticate("github", { session: false }), (req, res) => {
    const token = req.user.token
    if (!token) {
        return CustomError.createError("Autenticación fallida", `Token vacio o no proporcionado`, TIPOS_ERRORS.ERROR_AUTENTICACION)
    }
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(200).json({
        message: req.user,
    });
});



//PASSPORT-LOCAL
router.post("/registro", passport.authenticate("registro", { session: false }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    delete user.password;
    res.status(200).json(user)
})

router.post("/login", passport.authenticate("login", { session: false }),
    async (req, res) => {
        let { web } = req.body;
        let user = req.user
        delete user.password;
        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("userCookie", token, { httpOnly: true })
        logger.info(token)
        if (web) {
            if (user.rol === "admin") {
                return res.redirect("/realTimeProducts");
            }
            return res.redirect("/products");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(user)
        }
    }
)


router.get("/data", passportCall("jwt"), authorization(["user", "admin"]), UserController.getData)
router.get("/", UserController.getUsers)
router.get("/:uid", passportCall("jwt"), authorization(["user"]), UserController.getBy)

router.post("/updatePassword", UserController.updatePassword)

router.put('/premium/:uid', UserController.updateRol)
router.delete("/:uid", UserController.deleteUser)
