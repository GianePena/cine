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

    async getCartBy(filtro) {
        return await cartModelo.findOne(filtro)
    }
    async create(user, products) {
        if (!products) {
            products = []
        } else {
            products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        }
        return await cartModelo.create({
            user: user._id,
            products: products
        })
    }
    /*async create(uid, products) {
        const newCart = await cartModelo.create({
            user: uid,
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        });
        return newCart
    }*/
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




