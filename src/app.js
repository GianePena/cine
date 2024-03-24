
const express = require("express")
const PORT = 3000
const app = express()
const ProductManager = require("./productManager")

const productManager = new ProductManager("./src/productos.json")

app.get("/", (req, res) => {
    res.send("Proyecto: Ecommerce backend")
})

app.get("/products", (req, res) => {
    let products = productManager.getProducts()
    limit = req.query.limit
    if (limit) {
        limit = Number(limit)
        products = products.slice(0, limit)
    }
    res.json(products)
})

app.get("/products/:id", (req, res) => {
    console.log("entro");
    let id = req.params.id
    id = Number(id)
    console.log(typeof id);
    product = productManager.getProductById(id)
    res.json(product)

})
app.listen(PORT, () => {
    console.log("SEVER ONLINE")
})



