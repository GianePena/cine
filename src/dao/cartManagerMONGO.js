import mongoose from "mongoose";
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";
import { userModelo } from "./models/userModelo.js";
import { productModelo } from "./models/productModelo.js";
import { logger } from "../utils/logger.js";

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
    async create(products) {
        return await cartModelo.create({
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity || 1,
            }))
        })
    }

    async create(uid, products) {
        let user = await this.findUserBy(uid);
        if (!user) {
            logger.warn(`Usuario con email ${uid} no encontrado`)
            return CustomError.createError(
                "Error al crear cart", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
            let newCart;
            for (let p of products) {
                let product = await productModelo.findById(p.product);
                if (!product) {
                    return CustomError.createError(
                        "Error al crear el carrito", `Producto con ID ${p.product} no encontrado`, TIPOS_ERRORS.NOT_FOUND
                    )
                }
                if (user.rol === "premium" && product.owner === user.email) {
                    return CustomError.createError(
                        "Error al crear el carrito", "No es posible agregar un producto creado por usted mismo", TIPOS_ERRORS.ERROR_AUTORIZACION
                    )
                }
            }
            newCart = await cartModelo.create({
                products: products.map(p => ({
                    product: new mongoose.Types.ObjectId(p.product),
                    quantity: p.quantity || 1,
                }))
            });
            user.cart = newCart._id;
            await user.save();
            logger.info(`Nuevo cart ${newCart}`)
            return newCart;
        } else {
            logger.error(`El usuario ${uid} ya tiene una cart asociado`)
            return CustomError.createError(
                "Error al crear el carrito", "El usuario ya tiene una cart asociado", TIPOS_ERRORS.ERROR_AUTORIZACION
            )
        }
    }
    async addProductsToCart(cid, newProducts) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al agregar productos al cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
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
        logger.info(`Nuevo cart ${cart}`)
        return cart
    }
    async updateQuantity(cid, pid, quantity) {
        let cartToUpdate = await this.getCartById(cid);
        if (!cartToUpdate) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al agregar productos al cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
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
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al modificar el cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        logger.info(`Carrito a modificar ${cartToUpdate}`)
        const finalProducts = cartToUpdate.products.concat({ products })
        cartToUpdate.products = finalProducts
        logger.info(`Productos modificados ${finalProducts}`)
        return await cartModelo.updateOne({ _id: cid }, { products: finalProducts });
    }
    async removeProduct(cid, pid) {
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
        if (!cartToUpdate) {
            logger.warn(`Cart con ${cid} no encontrado`)
            return CustomError.createError(
                "Error al modificar el cart", `Cart con ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
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

