import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { logger } from "../utils/logger.js";

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
    getCartById = async (id) => {
        const cart = await this.dao.getCartById(id)
        if (!cart) {
            logger.error(`Cart ${cart} NO ENCONTRADO`)
            return CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
        return this.dao.getCartById(id)
    }
    createCart = async (uid, products) => {
        const newCart = await this.dao.create(uid, products)
        return newCart;
    }
    addProductsToCart = async (cid, products) => {
        return this.dao.addProductsToCart(cid, products);
    }

    updateQuantity = async (cid, pid, quantity) => {
        return this.dao.updateQuantity(cid, pid, quantity)
    }
    updateCart = async (cid, products) => {

        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            logger.error(`Cart ${cart} NO ENCONTRADO`)
        }
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
            CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
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