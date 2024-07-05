//EXPRESS
import express from "express";
import { config } from "./config/config.js";
import compression from "express-compression";
//HANDLEBARS
import { engine } from "express-handlebars";
//ROUTES
import { router as productsRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import { router as userRouter } from "./routes/userRouter.js";
//SOCKET
import { Server } from "socket.io";
//MONGOOSE
import mongoose from "mongoose"
//COOKIE
import cookieParser from "cookie-parser";
//SESSIONS
//import session from 'express-session'
//PASPORT
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
//MIDDLEWARE DE  ERRORES
import { errorHandler } from "./middleware/errorHandler.js";

import { ProductManagerMONGO as ProductManager } from "./DAO/productManagerMONGO.js";
import { messageModelo } from "./dao/models/messagesModelo.js"


const PORT = config.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//COOKIES
app.use(cookieParser())
//COMPRESSION --> comprime toda la salida siempre y cuando este comprimida por otro metodo antes
app.use(compression({ brotli: { enabled: true } }))//indica que comprima con el metodo brotli
//ver el tipo de compresein segun la informacion que se envia
//--------------------------------------


//PASPORT JWT
initPassport()
app.use(passport.initialize())

//HANDLEBARS
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./src/views")

//MIDDLEWARE DE  ERRORES
app.use(errorHandler)
//ARCHIVOS ESTATICOS
app.use(express.static("./src/public"))
//ROUTES
app.use("/user", userRouter)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);


const serverHTTP = app.listen(PORT, () => {
    console.log("SERVER ONLINE");
});


//SOCKET
const io = new Server(serverHTTP);
const productManager = new ProductManager("../src/api/products.json");

let users = []
let messages = []


io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    socket.emit("listProducts", productManager.getProducts());
    socket.on("addProduct", ({ title, category, description, price, thumbnail, code, stock, status }) => {
        if (title && category && description && price && thumbnail && stock) {
            productManager.addProduct(title, category, description, price, thumbnail, code, stock, status);
            io.emit("listProducts", productManager.getProducts());
        } else {
            console.error("Datos de producto incompletos:");
        }
    });
    socket.on('deleteProduct', ({ id }) => {
        productManager.deleteProduct(id)
        io.emit("listProducts", productManager.getProducts());
    })
    ///----------------chat------------
    socket.on("usuario", ({ user, email }) => {
        if (!users.includes({ user, email })) {
            users.push({ user, email });
            socket.emit("nuevoUsuario", user);
            socket.broadcast.emit("nuevoUsuario", user);
        }
    });
    socket.on("mensaje", async ({ user, email, message }) => {
        if (user && email && message) {
            try {
                const nuevoMensaje = await messageModelo.create({
                    name: user,
                    email: email,
                    message: message,
                });
                console.log('Mensaje guardado en MongoDB:', nuevoMensaje);
                messages.push({ user, email, message });
                io.emit("nuevoMensaje", { user, message });
            } catch (error) {
                console.error('Error al guardar el mensaje en MongoDB:', error);
            }
        }
    });
});

//CONECCION BASE DE DATOS
const connDB = async () => {
    try {
        await mongoose.connect(
            config.MONGO_URL, { dbName: config.DB_NAME }
        )
        console.log("DB Online...!!!")
    }
    catch (error) {
        console.log("Error al conectar a DB", error.message)
    }
}
connDB()
