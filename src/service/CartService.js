import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"
import { ProductManagerMONGO as ProductManager } from "../DAO/productManagerMONGO.js";
import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

class CartService {
    constructor() {
        this.cartManager = new CartManager(),
            this.productManager = new ProductManager(),
            this.userManager = new UserManager()
    }
    getCarts = async () => {
        const carts = await this.cartManager.getAll()
        if (carts.length > 0) {
            return carts
        }
        else {
            return CustomError.createError("Cart vacio", `Cart no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
    }
    getCartById = async (cid) => {
        const cart = await this.cartManager.getCartById(cid)
        if (!cart) {
            logger.error(`Cart ${cart} NO ENCONTRADO`)
            return CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
        return cart
    }
    controlStock = async (products) => {
        for (let p of products) {
            const product = await this.productManager.getProductById(p.product);
            if (!product) {
                return CustomError.createError(
                    `Error al actualizar la cantidad en el cart`,
                    `Producto con ID no encontrado`,
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
        return true;
    }
    createCart = async (uid, products) => {
        let stockSuficiente = await this.controlStock(products)
        if (stockSuficiente === true) {
            if (uid) {
                const user = await this.userManager.getUserById(uid)
                if (!user) {
                    logger.warn(`Usuario con ID ${uid} no encontrado`);
                    return CustomError.createError("Error al crear cart", `Usuario con ID ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND);
                }
                if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
                    for (let p of products) {
                        if (user.rol === "premium" && p.owner === user.email) {
                            return CustomError.createError("Error al crear el carrito", "No es posible agregar un producto creado por usted mismo", TIPOS_ERRORS.ERROR_AUTORIZACION);
                        }
                    }
                    let uid = user._id
                    const newCart = await this.cartManager.create(products, uid)
                    if (!newCart || !newCart._id) {
                        logger.error('Error al crear un nuevo cart: El objeto retornado es undefined o no contiene un _id');
                        return CustomError.createError('Error al crer el cart', 'newCart no creado', TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                    }
                    const updatedUser = this.userManager.addCartToUser(user, newCart)
                    if (!updatedUser) {
                        logger.error(`Error al actualizar el usuario con el nuevo carrito: ${uid}`);
                        return CustomError.createError('Error al actualizar el usuario con el nuevo carrito', `cart no creado`, TIPOS_ERRORS.NOT_FOUND)
                    }
                    let usercart = await this.cartManager.getCartBy({ _id: user.cart })
                    logger.info(`Nuevo cart creado y asociado al usuario ${uid}: ${newCart}`);
                    return usercart
                } else {
                    logger.warn(`El usuario con ID ${uid} ya tiene un carrito asignado`);
                    return user.cart;
                }
            } else {
                const newCart = await this.cartManager.create(products)
                if (!newCart || !newCart._id) {
                    logger.error('Error al crear un nuevo cart: El objeto retornado es undefined o no contiene un _id');
                    return CustomError.createError('Error al crer el cart', 'newCart no creado', TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                }
                logger.info(`Nuevo cart creado sin asociar a usuario: ${newCart}`);
                return newCart;
            }
        }
    }
    addProductsToCart = async (cid, products) => {
        const cart = await this.cartManager.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al agregar productos al cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        let stockSuficiente = await this.controlStock(products);
        if (stockSuficiente === true) {
            for (const p of products) {
                let existingProductInCart = cart.products.find(prod => {
                    const prodId = prod.product._id || prod.product;
                    return prodId.toString() === p.product.toString();
                })
                if (existingProductInCart) {
                    existingProductInCart.quantity += p.quantity;
                } else {
                    cart.products.push({
                        product: p.product,
                        quantity: p.quantity
                    });
                }
            }
            const updatedCart = await this.cartManager.updateCart(cart);
            return updatedCart;
        }
    };
    updateQuantity = async (cid, pid, quantity) => {
        const cart = await this.cartManager.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.productManager.getProductById(pid)
        if (product.stock < quantity) {
            logger.warn(`Cantidad insuficentes`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cantidad insuficiente para el producto con ID ${pid}`,
                TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
            );
        }
        let findProduct = cart.products.find(p => p.product.equals(pid))
        if (findProduct) {
            findProduct.quantity = quantity
            const updatedCart = await this.cartManager.updateCart(cart);
            return updatedCart
        }
    }
    updateCart = async (cid, products) => {
        let cart = await this.cartManager.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        let stockSuficiente = await this.controlStock(products);
        if (stockSuficiente === true) {
            cart.products = products.map(p => ({
                product: p.product,
                quantity: p.quantity
            }));
            const updateCart = await this.cartManager.updateCart(cart)
            return updateCart
        }
    }
    removeProduct = async (cid, pid) => {
        let cart = await this.cartManager.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.productManager.getProductById(pid)
        if (!product) {
            logger.warn(`Producto con ${pid} no encintrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Producto con ID ${pid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let indexProduct = cart.products.findIndex(p => p.product._id.toString() === pid);
        cart.products.splice(indexProduct, 1);
        const updateCart = await this.cartManager.updateCart(cart);
        return updateCart
    }
    removeAllProducts = async (cid) => {
        let cart = await this.cartManager.getCartById(cid);
        if (!cart) {
            logger.warn(`Cart con ID ${cid} no encontrado`);
            return CustomError.createError(
                "Error al actualizar la cantidad en el cart",
                `Cart con ID ${cid} no encontrado`,
                TIPOS_ERRORS.NOT_FOUND
            );
        }
        cart.products = []
        const updateCart = await this.cartManager.updateCart(cart)
        return updateCart
    }
    purchase = async (cid) => {
        const cart = await this.cartManager.getCartById(cid)
        if (!cart) {
            CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            logger.error(`Cart ${cart} NO ENCONTRADO`)
        }
        const user = await this.userManager.getUserBy({ cart: cid })
        if (!user) {
            CustomError.createError("User NotFound Error", `User con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
        }
        let totalAmount = 0;
        for (const item of cart.products) {
            const productId = item.product._id || item.product;
            const quantity = item.quantity;
            const product = await this.productManager.getProductById(productId)
            if (product.stock < quantity) {
                insufficientStock.push({ product, quantity });
            } else {
                console.log(`PRODUCTO STOCK VIAJO: ${product.stock}`);
                totalAmount += product.price * quantity;
                product.stock -= quantity
                await product.save()
                console.log(`PRODUCTO STOCK ACT: ${product.stock}`);
            }
        }
        const ticket = await this.cartManager.createTicket(totalAmount, user.email);
        await cart.save()
        return { ticket }
    }
}

export const cartService = new CartService()