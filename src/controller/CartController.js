import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
const cartManager = new CartManager()
export class CartController {
    static getCart = async (req, res) => {
        try {
            let cartProducts = await cartManager.getCarts()
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ cartProducts })
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getCartById = async (req, res) => {
        try {
            const { id } = req.params
            let cart = await cartManager.getCartById(id)
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ cart });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static createCart = async (req, res) => {
        try {
            const { products, username, country } = req.body;
            if (!products) {
                return res.status(400).json({ error: "Faltan completar todos los campos" });
            }
            const newCart = await cartManager.createCart(products, username, country);
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
            let updateproduct = await cartManager.updateQuantity(cid, pid, quantity)
            res.status(200).json({ updateproduct })
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static updateCart = async (req, res) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            let updateCart = await cartManager.updateCart(cid, products)
            res.status(200).json({ updateCart })
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeProduct = async (req, res) => {
        let { cid, pid } = req.params
        try {
            let removeProduct = await cartManager.removeProduct(cid, pid)
            res.status(200).json({ removeProduct })
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeAllProduct = async (req, res) => {
        console.log('asdnasd kasd')
        let { cid } = req.params
        console.log(cid);
        try {
            let removeProducts = await cartManager.removeAllProducts(cid)
            if (!cid) {
                return res.status(404).json({ error: `Cart ${cid} no encontrado` });
            }
            res.status(200).json({ removeProducts })
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
}