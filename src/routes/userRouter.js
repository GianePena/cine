
import { Router } from "express";
import passport from "passport";

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
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `Fallo al autenticar...!!!`
        }
    )
})


//PASSPORT GITHUB
router.get('/github', passport.authenticate("github", {}), (req, res) => { });

router.get('/callbackGithub', passport.authenticate("github", { session: false }), (req, res) => {
    const token = req.user.token
    console.log(req.user)
    console.log("ROL DEL USUARIO:" + req.user.rol)
    if (!token) {
        return res.status(401).json({ message: 'Autenticación fallida' });
    }
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(201).json({
        message: req.user,
    });
});//ACA el token esta dentro del req.user=token se alamacena el la cokie



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
        let user = req.user //aca el  token viene directo del req.user y se alamcana en la cokie
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
router.get("/:id", UserController.getBy)
router.put("/:uid", UserController.updateUserCart);
router.delete("/:id", UserController.deleteUser)