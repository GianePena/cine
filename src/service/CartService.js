import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
import { cartModelo } from "../DAO/models/cartModelo.js";
import { productModelo } from "../DAO/models/productModelo.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

class CartService {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async () => {
        const carts = await this.dao.getAll()
        if (carts.length > 0) {
            return carts
        }
        else {
            return CustomError.createError("Cart vacio", `Cart no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
    }
    getCartById = async (cid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            logger.error(`Cart ${cart} NO ENCONTRADO`)
            return CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
        return this.dao.getCartById(cid)
    }
    async createCart(products) {
        try {
            const newCart = await this.dao.create(products);
            return newCart;
        } catch (error) {
            throw new Error("Error al crear cart: " + error.message);
        }
    }
    createCart = async (uid, products) => {
        if (uid) {
            const user = await this.dao.findUserBy(uid);
            if (!user) {
                logger.warn(`Usuario con ID ${uid} no encontrado`);
                throw CustomError.createError("Error al crear cart", `Usuario con ID ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND);
            }
            if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
                for (let p of products) {
                    if (user.rol === "premium" && p.owner === user.email) {
                        throw CustomError.createError("Error al crear el carrito", "No es posible agregar un producto creado por usted mismo", TIPOS_ERRORS.ERROR_AUTORIZACION);
                    }
                }
                const newCart = await this.dao.create(products);
                if (!newCart || !newCart._id) {
                    logger.error('Error al crear un nuevo cart: El objeto retornado es undefined o no contiene un _id');
                    throw new Error('Error al crear un nuevo cart');
                }
                user.cart = newCart._id;
                await user.save();
                logger.info(`Nuevo cart creado y asociado al usuario ${uid}: ${newCart}`);
                return newCart;
            }
        } else {
            const newCart = await this.dao.create(products);
            if (!newCart || !newCart._id) {
                logger.error('Error al crear un nuevo cart: El objeto retornado es undefined o no contiene un _id');
                throw new Error('Error al crear un nuevo cart');
            }
            logger.info(`Nuevo cart creado sin asociar a usuario: ${newCart}`);
            return newCart;
        }
    }
    addProductsToCart = async (cid, products) => {
        const cart = await this.dao.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            throw CustomError.createError(
                "Error al agregar productos al cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        const updatedCart = await this.dao.addProductsToCart(cid, products);
        return updatedCart;
    }
    updateQuantity = async (cid, pid, quantity) => {
        const cart = await this.dao.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        const updatedCart = await this.dao.updateQuantity(cid, pid, quantity);
        return updatedCart;
    }
    updateCart = async (cid, products) => {
        const updateCart = await this.dao.updateCart(cid, products)
        return updateCart
    }
    removeProduct = async (cid, pid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            logger.error(`Cart ${cart} NO ENCONTRADO`)
        }
        const updateCart = await this.dao.removeProduct(cid, pid)
        return updateCart
    }
    removeAllProducts = async (cid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            logger.error(`Cart ${cart} NO ENCONTRADO`)
        }
        const updateCart = await this.dao.removeAllProducts(cid)
        return updateCart
    }
    purchase = async (cid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            logger.error(`Cart ${cart} NO ENCONTRADO`)
        }
        const user = await this.dao.findUserByCartId(cid)
        if (!user) {
            CustomError.createError("User NotFound Error", `User con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
        //let insufficientStock = [];
        let totalAmount = 0;
        for (const item of cart.products) {
            const productId = item.product._id || item.product;
            const quantity = item.quantity;
            const product = await productModelo.findById(productId)
            if (product.stock < quantity) {
                //insufficientStock.push({ , quantity });
                insufficientStock.push({ product, quantity });
            } else {
                console.log(`PRODUCTO STOCK VIAJO: ${product.stock}`);
                totalAmount += product.price * quantity;
                product.stock -= quantity
                await product.save()
                console.log(`PRODUCTO STOCK ACT: ${product.stock}`);
            }
        }
        /*if (insufficientStock.length > 0) {
            CustomError("Cart incompleto", "Stock isnuficiente en alugnos productos", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            logger.warn(`productos con stock insuficiente ${insufficientStock}`)
            console.log(insufficientStock);
            return insufficientStock
        }*/
        const ticket = await this.dao.createTicket(totalAmount, user.email);
        //cart.products.push(insufficientStock)
        await cart.save()

        return { ticket }
    }
}
export const cartService = new CartService(new CartManager())