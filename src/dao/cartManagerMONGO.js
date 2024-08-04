import mongoose from "mongoose";
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";
import { userModelo } from "./models/userModelo.js";
import { productModelo } from "./models/productModelo.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { calcularStock } from "../utils/utils.js";
class CartManagerMONGO {
    async getAll() {
        return await cartModelo.find().lean()
    }
    async getCartById(cid) {
        return await cartModelo.findById(cid).populate('products.product')
    }
    async findUserBy(uid) {
        return await userModelo.findById(uid)
    }
    async findUserByCartId(cartId) {
        return await userModelo.findOne({ cart: cartId });
    }
    async create(products) {
        for (let p of products) {
            const product = await productModelo.findById(p.product);
            if (!product) {
                logger.warn(`Producto con ID ${cid} no encontrado`);
                return CustomError.createError(
                    "Error al actualizar la cantidad en el cart",
                    `Producto con ID ${cid} no encontrado`,
                    TIPOS_ERRORS.NOT_FOUND
                )
            }
            if (product.stock < p.quantity) {
                logger.warn(`stock INSUFICIENTE del producto con ID ${product._id}`);
                return CustomError.createError(
                    "Error al agregar productos al carrito",
                    `Cantidad insuficiente de stock`,
                    TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
                );
            }
        }
        const newCart = await cartModelo.create({
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        });
        return newCart
    }
    async addProductsToCart(cid, products) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al agregar productos al cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        for (let p of products) {
            const product = await productModelo.findById(p.product);
            if (!product) {
                logger.warn(`Producto con ID ${cid} no encontrado`);
                return CustomError.createError(
                    "Error al actualizar la cantidad en el cart",
                    `Producto con ID ${cid} no encontrado`,
                    TIPOS_ERRORS.NOT_FOUND
                )
            }
            if (product.stock < p.quantity) {
                logger.warn(`stock INSUFICIENTE del producto con ID ${product._id}`);
                return CustomError.createError(
                    "Error al agregar productos al carrito",
                    `Cantidad insuficiente de stock`,
                    TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
                );
            }
            let existingProduct = cart.products.find(p => p.product.equals(product._id))
            if (existingProduct) {
                existingProduct.quantity += p.quantity;
            } else {
                cart.products.push({
                    product: product._id,
                    quantity: p.quantity
                });
            }
        }
        await cart.save()
        logger.info(`Cart actualizado ${cart}`)
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
        let product = await productModelo.findById(pid)
        if (!product) {
            logger.warn(`Producto con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Producto con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (product.stock < quantity) {
            logger.warn(`stock INSUFICIENTE: Stock disponible: ${product.stock}, stock solicitado: ${quantity}`);
            return CustomError.createError(
                "Error al agregar productos al carrito",
                `Cantidad insuficiente de stock`,
                TIPOS_ERRORS.NOT_FOUND
            );

        }
        let productInCart = cart.products.find(p => p.product.equals(product._id))
        if (!productInCart) {
            logger.warn(`Product with ID ${pid} not found in cart`);
            throw CustomError.createError(
                "Error updating quantity in the cart",
                `Product with ID ${pid} not found in the cart`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        productInCart.quantity = quantity;
        await cart.save();
        logger.info(`Cart modificado:${cart}`)
        return cart;
    }
    async updateCart(cid, products) {
        let cartToUpdate = await this.getCartById(cid);
        if (!cartToUpdate) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        for (const data of products) {
            let product = await productModelo.findById(data.product);
            if (!product) {
                logger.warn(`Product with ID ${data.product} not found`);
                throw CustomError.createError(
                    "Error updating the cart",
                    `Product with ID ${data.product} not found`,
                    TIPOS_ERRORS.NOT_FOUND
                );
            }
            if (product.stock < data.quantity) {
                logger.warn(`stock INSUFICIENTE del producto con ID ${cid}`);
                return CustomError.createError(
                    "Error al agregar productos al carrito",
                    `Cantidad insuficiente de stock`,
                    TIPOS_ERRORS.NOT_FOUND
                );
            }
        }
        cartToUpdate.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));
        await cartToUpdate.save();
        logger.info(`Nuevo Cart: ${cartToUpdate}`);
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
        if (!cartToUpdate) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al modificar el cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        cartToUpdate.products = []
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

