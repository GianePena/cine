import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
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
    createCart = async (uid, products) => {

        const user = await this.dao.findUserBy(uid);
        if (!user) {
            logger.warn(`Usuario con ID ${uid} no encontrado`);
            throw CustomError.createError("Error al crear cart", `Usuario con ID ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND);
        }
        if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
            for (let p of products) {
                if (user.rol === "premium" && products.owner === user.email) {
                    throw CustomError.createError("Error al crear el carrito", "No es posible agregar un producto creado por usted mismo", TIPOS_ERRORS.ERROR_AUTORIZACION);
                }
            }
            const newCart = await this.dao.create(products);
            user.cart = newCart._id;
            await user.save();
            logger.info(`Nuevo cart ${newCart}`);
            return newCart;
        } else {
            logger.error(`El usuario ${uid} ya tiene un cart asociado`);
            throw CustomError.createError("Error al crear el carrito", "El usuario ya tiene un cart asociado", TIPOS_ERRORS.ERROR_AUTORIZACION);
        }

    };

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
        if (updatedCart instanceof CustomError) {
            throw updatedCart;
        }
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
        if (updatedCart instanceof CustomError) {
            throw updatedCart;
        }
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
        let insufficientStock = [];
        let totalAmount = 0;
        for (let item of cart.products) {
            const { product, quantity } = item;
            if (product.stock < quantity) {
                insufficientStock.push(product._id);
            } else {
                totalAmount += product.price * quantity;
            }
        }
        if (insufficientStock.length > 0) {
            return { error: "Stock insuficiente", insufficientStock };
        }
        const user = await this.dao.findUserByCartId(cid)
        if (!user) {
            CustomError.createError("User NotFound Error", `User con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)

        }
        const ticket = await this.dao.createTicket(totalAmount, user.email);
        for (let item of cart.products) {
            await this.dao.updateProductStock(item.product._id, item.quantity)
        }
        await this.dao.removeAllProducts(cart);
        return { ticket };
    }
}

export const cartService = new CartService(new CartManager())