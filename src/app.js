
import express from "express";
import { engine } from "express-handlebars";
import { router as productsRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as vistaRouter } from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import { ProductManagerMONGO as ProductManager } from "./dao/productManagerMONGO.js";
import mongoose from "mongoose"
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", vistaRouter);

const serverHTTP = app.listen(PORT, () => {
    console.log("SERVER ONLINE");
});

const io = new Server(serverHTTP);
const productManager = new ProductManager("../src/api/products.json");

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
});


const connDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://gianellapena01:MiniGala1215@giane.xmh7olf.mongodb.net/?retryWrites=true&w=majority&appName=giane",
            {
                dbName: "ecommerce"
            }
        )
        console.log("DB Online...!!!")

    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }
}


connDB()