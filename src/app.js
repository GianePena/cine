import express from "express"
import { router as productsRouter } from "./routes/productRouter.js"
import { router as cartRouter } from "./routes/cartRouter.js"
const PORT = 3000


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.listen(PORT, () => {
    console.log("SEVER ONLINE")
})
