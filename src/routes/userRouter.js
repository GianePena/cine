import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/userManagerMONGO.js";
//import { generaHash, validarPasword } from "../utils.js"
import passport from "passport";

export const router = Router()

//let reMedio = /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/

const userManager = new UserManager()
//app.use("/user", userRouter)


//CRUD
//PASSPORT GITHUB
router.get('/github', passport.authenticate("github", {}), (req, res) => { })//peticion del usario a esta ruta--> redirecciona a github y vuleve a "/callbackGithub"
router.get('/callbackGithub', passport.authenticate("github", { failureRedirect: "/user/error" }), (req, res) => {
    //registro y login 
    req.session.user = req.user
    if (web) {
        return res.redirect("/products");
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: req.user })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        let user = await userManager.getById(id)
        if (!user) {
            console.log(`Usuario con ID ${id} no encontrado`);
            res.status(404).json({ message: "usuario no encontrado" }) //404 not found y 400  indica que la solicitud del cliente está mal formada, incompleta o no se puede entender.
        }
        res.status(200).json({ user })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
    }
})

router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `Fallo al autenticar...!!!`
        }
    )

})
//PASSPORT-LOCAL
router.post("/registro", passport.authenticate("registro", { failureRedirect: "/user/error" }), async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        message: "Registro correcto...!!!",
        nuevoUsuario: req.user
    })
})
router.post("/login", passport.authenticate("login", { failureRedirect: "/user/error" }),
    async (req, res) => {
        let { web } = req.body;
        let user = { ...req.user }
        delete user.password
        req.session.user = user
        if (web) {
            return res.redirect("/products");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Login correcto", user })
        }
    })




/*
router.post("/registro", async (req, res) => {
    let { name, email, password } = req.body
    let rol = "usuario"
    try {
        if (!name || !email || !password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `completar la totalidad de los campos` })
        }
        console.log(name, email, password);
        const userExistente = await userManager.getBy({ email })
        if (!reMedio.test(email)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese un email valido` })
        }
        if (email === userExistente) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe ${email}` })
        }
        password = generaHash(password)
        if (email === "adminCoder@coder.com" && password === "adminCoder123") {
            rol = "admin"
            console.log({ name, email, password, rol });
        }
        let newUser = await userManager.createUser({ name, email, password, rol })
        res.status(200).json({
            message: "Registro correcto...!!!",
            newUser
        })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
    }
})
*/

/*
router.post("/login", async (req, res) => { //es un post poirque tengo que tomar datos de body
    let { email, password, web } = req.body
    try {
        if (!email || !password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `completar email y password` })
        }
        let user = await userManager.getBy({ email })
        console.log();
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Usuario NO registrado` })
        }
        if (!validarPasword(password, user.password)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Pasword invalida` })
        }
        user = { ...user }
        delete user.password //para no mostrar la contraseña
        req.session.user = user //crear la session
        return res.redirect("/products");
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Credenciales invalidas" })
    }
})

*/

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
        let updateUser = await userManager.updateUserName(id, name)
        res.status(200).json({ updateUser })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const deleteUser = await userManager.deleteUser(id)
        res.status(200).json({ deleteUser })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
    }
})

router.get("/", async (req, res) => {
    try {
        const users = await userManager.getUsers()
        res.status(200).json({ users })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
    }
})
