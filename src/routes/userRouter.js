import { Router } from "express";
import passport from "passport";

import jwt from "jsonwebtoken"
import { SECRET } from "../utils.js";
import { passportCall } from "../utils.js";
import { UserManagerMONGO as userManager } from "../dao/userManagerMONGO.js";
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
    // Registro y login 
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: 'Autenticacion fallida' });
    }
    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });
    res.cookie('userCookie', token, { httpOnly: true });
    res.status(200).json({
        message: "Registro correcto...!!!",
    })
});



//PASSPORT-LOCAL
router.post("/registro", passport.authenticate("registro", { session: false }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        message: "Registro correcto...!!!",
        newUser: req.user//ESE REQ. USER LO GENERA PASSPORT
    })
})


router.post("/login", passport.authenticate("login", { session: false }),
    async (req, res) => {
        let { web } = req.body;
        let user = { ...req.user }
        delete user.password
        let token = jwt.sign(user, SECRET, { expiresIn: "1h" })
        res.cookie("userCookie", token, { httpOnly: true })
        if (web) {
            //return res.redirect("/products");
            return res.redirect("/usuario");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Login correcto", user })
        }
    }

)

router.get("/usuario", passportCall("jwt"), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        mensaje: 'Perfil usuario',
        usuario: req.user
    });
})



