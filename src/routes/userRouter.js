import { Router } from "express";
import { UserManagerMONGO as UserManager } from "../dao/userManagerMONGO.js";

export const router = Router()

let reMedio = /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/

const userManager = new UserManager()
//app.use("/user", userRouter)



//CRUD

router.get("/", async (req, res) => {
    try {
        const users = await userManager.getUsers()
        res.status(200).json({ users })
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({ error: "Error fetching users" })
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
        if (email === userExistente) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe ${email}` })
        }
        if (email === "adminCoder@coder.com" && password === "adminCoder123") {
            rol = "admin"
            console.log({ name, email, password, rol });
        }
        if (!reMedio.test(email)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese un email valido` })
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

router.post("/login", async (req, res) => { //es un post poirque tengo que tomar datos de body
    let { email, password } = req.body
    try {
        if (!email || !password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `completar email y password` })
        }
        let user = await userManager.getBy({ email, password })
        console.log();
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Usuario NO registrado` })
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