import express from "express";
import { config } from "./config/config.js";
import compression from "express-compression";


import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

import { engine } from "express-handlebars";

import { router as productsRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import { router as userRouter } from "./routes/userRouter.js";

import { Server } from "socket.io";

import mongoose from "mongoose"

import cookieParser from 'cookie-parser';

import passport from "passport";
import { initPassport } from "./config/passport.config.js";

import { errorHandler } from "./middleware/errorHandler.js";

import { logger, middLogger } from "./utils/logger.js"
import { ProductManagerMONGO as ProductManager } from "./DAO/productManagerMONGO.js";
import { messageModelo } from "./DAO/models/messagesModelo.js";



const PORT = config.PORT;
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middLogger)


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce API",
            version: "1.0.0",
            description: "API para cart y products"
        }
    },
    apis: ["./src/docs/*.yaml"]
};
const spec = swaggerJSDoc(options);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

app.use(compression({ brotli: { enabled: true } }))

initPassport()


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./src/views")

app.use(passport.initialize())
app.use(express.static("./src/public"))
app.use("/api/user", userRouter)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);


app.use(errorHandler)



const serverHTTP = app.listen(PORT, () => {
    logger.info(`SERVER ONLINE EN PUERTO ${PORT}`)
});


const io = new Server(serverHTTP);
const productManager = new ProductManager("../src/api/products.json");

let users = []
let messages = []


io.on("connection", (socket) => {
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


const connDB = async () => {
    try {
        await mongoose.connect(
            config.MONGO_URL, { dbName: config.DB_NAME }
        )
        logger.info(`Conexion de DB exitosa: DB online`);
    }
    catch (error) {
        logger.error("Error al conectar a DB", error.message)
    }
}
connDB()


