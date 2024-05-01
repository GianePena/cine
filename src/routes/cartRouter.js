import { Router } from 'express';
import { CartManagerMONGO as CartManager } from "../dao/cartManagerMONGO.js"


export const router = Router()
const cartManager = new CartManager("./api/cart.json");
router.get("/", async (req, res) => {
    try {
        let cartProducts = await cartManager.getCartProducts()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ cartProducts })
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: `Error en el servidor`
            }
        )
    }
})

router.post("/", async (req, res) => {
    const { title, quantity } = req.body;
    if (!title || !quantity) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({ error: "completar la totalidad de los campos" })
    }
    try {
        let newCartProduct = await cartManager.addCartProduct(quantity, title);
        res.status(201).json(
            {
                message: "Producto agregado correctamente",
                newCartProduct
            });
    } catch (error) {
        console.error(error);
        res.setHeader('Content-type', 'application/json')
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
});