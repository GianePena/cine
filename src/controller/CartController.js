import { CartDTO } from "../DTO/CartDTO.js"
import { cartService } from "../service/CartService.js"

export class CartController {
    static getCarts = async (req, res) => {
        try {
            let carts = await cartService.getCarts()
            let cartDTO = carts.map(c => new CartDTO(c))
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ carts })
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getCartById = async (req, res) => {
        try {
            const { id } = req.params
            let cart = await cartService.getCartById(id)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(new CartDTO(cart));
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static createCart = async (req, res) => {
        const { uid } = req.params;
        const { products } = req.body;
        try {
            const newCart = await cartService.createCart(uid, products);
            res.status(201).json({ newCart });
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static updateQuantity = async (req, res) => {
        let { quantity } = req.body
        let { cid, pid } = req.params
        try {
            let updateproduct = await cartService.updateQuantity(cid, pid, quantity)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ updateproduct })

        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static updateCart = async (req, res) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            const updateCart = await cartService.updateCart(cid, products)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(new CartDTO(updateCart))
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }


    static addProductsToCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body.products
        try {
            const updatedCart = await cartService.addProductsToCart(cid, products);
            res.status(200).json({ message: 'Productos agregados con éxito', updatedCart });
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeProduct = async (req, res) => {
        let { cid, pid } = req.params
        try {
            let removeProduct = await cartService.removeProduct(cid, pid)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(`Producto eliminado con exito: ${removeProduct}`)
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeAllProduct = async (req, res) => {
        let { cid } = req.params
        try {
            if (!cid) {
                return res.status(404).json({ error: `Cart ${cid} no encontrado` });
            }
            let removeProducts = await cartService.removeAllProducts(cid)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(`Cart ${cid} productos eliminados con exito`)
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static purchase = async (req, res) => {
        const { cid } = req.params;
        try {
            const result = await cartService.purchase(cid);
            if (result.error) {
                return res.status(400).json({ error: result.error, insufficientStock: result.insufficientStock });
            }
            res.status(201).json({ ticket: result.ticket });
        } catch (error) {
            console.error('Error completando la compra:', error);
            res.status(500).json({ error: 'Error completando la compra' });
        }
    }
}


