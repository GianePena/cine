import mongoose from "mongoose";
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";
import { userModelo } from "./models/userModelo.js";
import { productModelo } from "./models/productModelo.js";

class CartManagerMONGO {
    async getAll() {
        return await cartModelo.find();
    }

    async getCartById(id) {
        return await cartModelo.findById(id).populate('products.product')
    }
    async findUserBy(uid) {
        return await userModelo.findById(uid);
    }
    async findUserByCartId(cartId) {
        return await userModelo.findOne({ cart: cartId });
    }
    async create(uid, products) {
        let user = await this.findUserBy(uid)
        if (!user) {
            throw new Error("Usuario no encontrado, registarse ");
        }
        if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
            const newCart = await cartModelo.create({
                products: products.map(p => ({
                    product: new mongoose.Types.ObjectId(p.product),
                    quantity: p.quantity || 1,
                }))
            });
            user.cart = newCart._id;
            await user.save();
            return newCart;
        }
    }
    async addProductsToCart(cid, newProducts) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        newProducts.forEach(item => {
            let existingProduct = cart.products.find(p => p.product.toString() === item.product);
            if (existingProduct) {
                existingProduct.quantity += item.quantity;
            } else {
                cart.products.push({
                    product: item.product,
                    quantity: item.quantity
                });
            }
        });
        await cart.save()
        return cart
    }
    async updateQuantity(cid, pid, quantity) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products.forEach(p => {
            if (p.product._id.toString() === pid) {
                p.quantity = quantity;
            }
        });
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate)
    }
    async updateCart(cid, products) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        const finalProducts = cartToUpdate.products.concat({ products })
        cartToUpdate.products = finalProducts
        return await cartModelo.updateOne({ _id: cid }, { products: finalProducts });
    }
    async removeProduct(cid, pid) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products = cartToUpdate.products.filter(p => p.product._id.toString() != pid);
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate);
    }
    async removeAllProducts(cid) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products = []
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate)
    }
    async createTicket(amount, purchaser) {
        const newTicket = new ticketModelo({ amount, purchaser });
        return await newTicket.save();
    }
    async updateProductStock(productId, quantity) {
        return await productModelo.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
    }

}



export { CartManagerMONGO }

