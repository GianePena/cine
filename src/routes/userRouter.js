import { Router } from "express";
import passport from "passport";

import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import { UserController } from "../controller/UserController.js";
import { passportCall } from "../utils.js";
import { authorization } from "../middleware/auth.js"

import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js";
const userManager = new UserManager();
export const router = Router()


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
    const token = req.user;
    if (!token) {
        return res.status(401).json({ message: 'Autenticación fallida' });
    }
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(201).json({
        message: "Registro correcto...!!!",
    });
});



//PASSPORT-LOCAL
router.post("/registro", passport.authenticate("registro", { session: false }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        message: "Registro correcto...!!!",
        newUser: req.user//ESE REQ. USER LO GENERA PASSPORT
    })
})


router.post("/login", passport.authenticate("login", { session: false }),
    async (req, res) => {
        let { web } = req.body;
        let user = { ...req.user }
        delete user.password
        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "1h" })
        res.cookie("userCookie", token, { httpOnly: true })
        if (web) {
            //return res.redirect("/products")
            return res.redirect("/user/data");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Login correcto", user })
        }
    }

)
router.get("/data", passportCall("jwt"), authorization(["user", "admin"]), UserController.getData)
router.get("/", UserController.getUsers)
router.get("/:id", UserController.getUserBy)
router.put("/:uid", UserController.updateUserCart);
router.delete("/:id", UserController.deleteUser)