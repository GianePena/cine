import { Router } from 'express';
import CartManager from "../cartManager.js"

export const router = Router()
const cartManager = new CartManager("./api/cart.json");
router.get("/", (req, res) => {
    let cartProducts = cartManager.getCartProducts()
    res.json(cartProducts)
})
router.post("/", (req, res) => {
    const { quantity, title } = req.body;
    res.setHeader('Content-type', 'application/json')
    try {
        let newCartProduct = cartManager.addCartProduct(quantity, title);
        res.status(201).json({ message: "Producto agregado correctamente" });
        res.json(newCartProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
});