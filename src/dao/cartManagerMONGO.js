import mongoose from "mongoose";
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";
import { userModelo } from "./models/userModelo.js";
import { productModelo } from "./models/productModelo.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
class CartManagerMONGO {
    async getAll() {
        return await cartModelo.find();
    }
    async getCartById(cid) {
        return await cartModelo.findById(cid).populate('products.product')
    }
    async findUserBy(uid) {
        return await userModelo.findById(uid);
    }
    async findUserByCartId(cartId) {
        return await userModelo.findOne({ cart: cartId });
    }

    async create(products) {
        return await cartModelo.create({
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        });
    }
    async addProductsToCart(cid, products) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al agregar productos al cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        products.forEach(item => {
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
        logger.info(`Nuevo cart ${cart}`)
        return cart
    }
    async updateQuantity(cid, pid, quantity) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        cart.products.forEach(p => {
            if (p.product._id.toString() === pid) {
                p.quantity = quantity;
            }
        });
        return await cartModelo.updateOne({ _id: cart.id }, cart)
    }
    async updateCart(cid, products) {
        let cartToUpdate = await this.getCartById(cid);
        if (!cartToUpdate) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al modificar el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        cartToUpdate.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));
        await cartToUpdate.save();
        logger.info(`Carrito actualizado ${cartToUpdate}`);
        return cartToUpdate;
    }
    async removeProduct(cid, pid) {
        const cartToUpdate = await this.getCartById(cid);
        if (!cartToUpdate) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al modificar el cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        logger.info(`carrtio actual: ${cartToUpdate}`)
        cartToUpdate.products = cartToUpdate.products.filter(p => p.product._id.toString() != pid);
        logger.info(`carrtio actualizado: ${cartToUpdate}`)
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate);
    }
    async removeAllProducts(cid) {
        const cartToUpdate = await this.getCartById(cid);
        console.log(cartToUpdate);
        if (!cartToUpdate) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al modificar el cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        cartToUpdate.products = []
        console.log(cartToUpdate.products);
        return await cartToUpdate.save();
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

