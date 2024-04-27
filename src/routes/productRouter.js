import { Router } from 'express';
import ProductManager from "../productManager.js"
export const router = Router()

const productManager = new ProductManager("./api/products.json");

router.get("/", (req, res) => {
    let products = productManager.getProducts()
    let limit = req.query.limit;
    if (limit) {
        limit = Number(limit)
        products = products.slice(0, limit)
    }
    res.json(products)
})
router.get("/:id", (req, res) => {
    let id = req.params.id
    id = Number(id)
    console.log(typeof id);
    let product = productManager.getProductById(id)
    res.json(product)

})

router.post("/", (req, res) => {
    const { title, category, description, price, thumbnail, code, stock, status } = req.body;
    res.setHeader('Content-type', 'application/json')
    let products = productManager.getProducts()
    productManager.addProduct(title, category, description, price, thumbnail, code, stock, status);
    res.status(201).json({
        message: "Producto agregado correctamente",
        products: products,

    });
});
router.put("/:id", (req, res) => {
    let { id } = req.params;
    let { price } = req.body;;
    try {
        let updatedProduct = productManager.updateProduct(id, price);
        res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
});


router.delete("/:id", (req, res) => {
    let id = req.params.id
    try {
        const wasDeleted = productManager.deleteProduct(id)
        if (wasDeleted) {
            res.status(200).json({ message: `Producto con ID ${id} eliminado correctamente` });
        } else {
            res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
        }
    } catch (error) {
        console.log(error)
        return res.json({ error: "Error desconocido...!!!" })
            ;
    }

})
