
import { Router } from "express";
import passport from "passport";
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import { UserController } from "../controller/UserController.js";
import { passportCall } from "../utils/utils.js";

import { authorization } from "../middleware/auth.js"
import { usersGenerados } from "../DAO/mocking/mocks.js";
import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js";
const userManager = new UserManager();
export const router = Router()


router.get('/mockinguser', (req, res) => {
    res.status(200).json(usersGenerados)
    console.log(usersGenerados);
})


//app.use("/user", userRouter)

router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return CustomError.createError(`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, `Fallo al autenticar`, TIPOS_ERRORS.ERROR_SERVIDOR_INTERNO)
})


//PASSPORT GITHUB
router.get('/github', passport.authenticate("github", {}), (req, res) => { });

router.get('/callbackGithub', passport.authenticate("github", { session: false }), (req, res) => {
    const token = req.user.token
    console.log(req.user)
    console.log("ROL DEL USUARIO:" + req.user.rol)
    if (!token) {
        return CustomError.createError("Autenticación fallida", `Token vacio o no proporcionado`, TIPOS_ERRORS.ERROR_AUTENTICACION)
    }
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(201).json({
        message: req.user,
    });
});



//PASSPORT-LOCAL
router.post("/registro", passport.authenticate("registro", { session: false }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        newUser: req.user//ESE REQ. USER LO GENERA PASSPORT
    })
})

router.post("/login", passport.authenticate("login", { session: false }),
    async (req, res) => {
        let { web } = req.body;
        let user = req.user
        delete user.password;
        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("userCookie", token, { httpOnly: true })
        console.log(`TOKEN: ${token}`);
        if (web) {
            //return res.redirect("/products")
            if (user.rol === "admin") {
                return res.redirect("/realTimeProducts");
            }
            //return res.redirect("/user/data");
            return res.redirect("/products");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Login correcto", user })
        }
    }
)


router.get("/data", passportCall("jwt"), authorization(["user", "admin"]), UserController.getData)
router.get("/", UserController.getUsers)
router.put('/premium/:uid', UserController.updateRol)
router.get("/:id", passportCall("jwt"), authorization(["user"]), UserController.getBy)
router.delete("/:id", UserController.deleteUser)
router.post("/updatePassword", UserController.updatePassword)



import { transporter } from "../utils/mail.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { logger } from "../utils/logger.js";

let code = "C-4F74A8"
router.post('/sendCode', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return CustomError.createError("Error en el email", 'Email es necesario para recuperar la contraseña', TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
    }
    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("linkRecuperacionPassword", token, { httpOnly: true });
    req.logger.info(`Codigo: ${code}`)
    const link = `http://localhost:3000/newPassword?token=${token}`;
    const mailOptions = {
        from: "gianellapena01@gmail.com",
        to: email,
        subject: "Código de Recuperación de Contraseña",
        html: `<h2>Código de recuperación de contraseña:${code}</h2><br><hr> 
        <a href="${link}">Generar nueva contraseña</a>`
    };
    req.logger.info(mailOptions)
    transporter.sendMail(mailOptions)
        .then(resultado => res.send("Correo enviado: " + resultado.response))
        .catch(error => res.send("Error al enviar correo: " + error.message));
});