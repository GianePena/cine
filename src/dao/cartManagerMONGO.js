import mongoose from "mongoose";
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";


class CartManagerMONGO {
    async getAll() {
        return await cartModelo.find().lean()
    }
    async getCartById(cid) {
        return await cartModelo.findById(cid).populate('products.product')
    }
    async getCartBy() {
        return await cartModelo.findOne()
    }
    async create(products, uid) {
        const newCart = await cartModelo.create({
            user: uid,
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        });
        return newCart
    }
    async updateCart(cart) {
        await cart.save()
        return cart
    }
    async createTicket(amount, purchaser) {
        const newTicket = new ticketModelo({ amount, purchaser });
        return await newTicket.save();
    }
}



export { CartManagerMONGO }




