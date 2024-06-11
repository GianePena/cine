//import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
//const cartManager = new CartManager()
import { cartService } from "../service/CartService.js"
export class CartController {
    static getCarts = async (req, res) => {
        try {
            let carts = await cartService.getCarts()
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
            //let cart = await cartManager.getCartById(id)
            let cart = await cartService.getCartById(id)
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ cart });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static createCart = async (req, res) => {
        try {
            const { products, username } = req.body;
            if (!products && !username) {
                return res.status(400).json({ error: "Faltan completar todos los campos" });
            }
            const newCart = await cartService.createCart(products, username)
            res.setHeader('Content-Type', 'application/json');
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
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static updateCart = async (req, res) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            let updateCart = await cartService.updateCart(cid, products)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ updateCart })
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeProduct = async (req, res) => {
        let { cid, pid } = req.params
        try {
            let removeProduct = await cartService.removeProduct(cid, pid)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ removeProduct })
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static removeAllProduct = async (req, res) => {
        console.log('asdnasd kasd')
        let { cid } = req.params
        console.log(cid);
        try {
            if (!cid) {
                return res.status(404).json({ error: `Cart ${cid} no encontrado` });
            }
            let removeProducts = await cartService.removeAllProducts(cid)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ removeProducts })
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
}