import express from "express"
import { engine } from "express-handlebars"
import { router as productsRouter } from "./routes/productRouter.js"
import { router as cartRouter } from "./routes/cartRouter.js"
import { router as vistaRouter } from "./routes/vistas.routes.js"
import { Server } from "socket.io"
import ProductManager from "../src/productManager.js"
const productManager = new ProductManager("../src/api/products.json");

const PORT = 3000


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views");

app.use(express.static("public"));
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/", vistaRouter)

const serverHTTP = app.listen(PORT, () => {
    console.log("SEVER ONLINE")
})
const io = new Server(serverHTTP)

io.on("connection", (socket) => {
    console.log("Se ha conectado un cliente");
    socket.on("getProducts", () => {
        const products = productManager.getProducts();
        socket.emit("productos", products);
    });
    socket.on("addProduct", (addProduct) => {
        productManager.addProduct(addProduct);
        const products = productManager.getProducts();
        io.emit("productos", products);
    });
    socket.on("deleteProduct", (idEliminado) => {
        productManager.deleteProduct(idEliminado)
        const products = productManager.getProducts();
        io.emit("productos", products)
    })
});