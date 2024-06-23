import mongoose from "mongoose";

import { cartService } from "../service/CartService.js"
import { ticketModelo } from "../DAO/models/ticketModelo.js"
import { amount } from '../utils.js';
import { userModelo } from "../DAO/models/userModelo.js"
import { productModelo } from "../DAO/models/productModelo.js";
import { cartModelo } from "../DAO/models/cartModelo.js";
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
            let cartResult = await cartService.getCartById(id)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ cartResult });
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
    //-------------
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
        let { cid } = req.params
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


