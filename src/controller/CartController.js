import { cartService } from "../service/CartService.js"
import { userService } from "../service/UserService.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { transporter } from "../utils/mail.js";
import mongoose from "mongoose";
export class CartController {
    static getCarts = async (req, res, next) => {
        try {
            let carts = await cartService.getCarts()
            return res.status(200).json(carts)
        } catch (error) {
            req.logger.error(`Error fetching all carts: ${error.message}`)
            next(error)
        }
    }
    static getCartById = async (req, res, next) => {
        const { cid } = req.params
        try {
            let cart = await cartService.getCartById(cid)
            req.logger.debug(`id recibido ${cid}`)
            req.logger.info(cart)
            if (!cart) {
                return CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(cart);
        } catch (error) {
            req.logger.error(`Error fetching cart by ID `)
            next(error);
        }
    }
    static createCart = async (req, res, next) => {
        const { products, uid } = req.body;
        try {
            if (!Array.isArray(products)) {
                return CustomError.createError("Error al crear el cart", "Products debe ser un array", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS);
            }
            if (!products || products.length === 0) {
                req.logger.warn('Datos incompletos necesarios para producto');
                req.logger.debug(`Datos recibidos: ${uid}, ${products}`);
                return CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            for (const product of products) {
                if (!mongoose.Types.ObjectId.isValid(product.product)) {
                    return CustomError.createError("Error al crear cart", "Id del producto incorrecto", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                }
                if (isNaN(product.quantity)) {
                    return CustomError.createError(
                        "Datos incorrectos",
                        "La cantidad de los productos debe ser un número",
                        TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
                    )
                }
            }
            let newCart;
            if (uid) {
                if (!mongoose.Types.ObjectId.isValid(uid)) {
                    return CustomError.createError("Error al crear cart", "Id del usuario incorrecto o no valido", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                }
                newCart = await cartService.createCart(uid, products)
            } else {
                newCart = await cartService.createCart(null, products);
            }
            res.status(201).json(newCart);
            req.logger.info(`Cart creado exitosamente: ${newCart}`);
        } catch (error) {
            req.logger.error(`Error en la creacion de un nuevo cart: ${error.message}`);
            next(error);
        }
    }
    static updateQuantity = async (req, res, next) => {
        let { quantity } = req.body
        let { cid, pid } = req.params
        try {
            if (!quantity) {
                return CustomError.createError("Faltante de datos", `Completar la totalidad de los campos`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            if (isNaN(quantity)) return CustomError.createError("Dato incorrecto", "La cantidad de los productos debe ser un número", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            let updateCart = await cartService.updateQuantity(cid, pid, quantity)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(updateCart)
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static updateCart = async (req, res, next) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            if (!products || !Array.isArray(products) || products.length === 0) {
                return CustomError.createError("Error en la actualizadion del cart", "La lista de productos es inválida o está vacía", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            for (let product of products) {
                if (!mongoose.Types.ObjectId.isValid(product.product) || isNaN(product.quantity)) {
                    return CustomError.createError("Error en la actualizadion del cart", "Id invlado o cantidad invalida dede ser un numero", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                }
            }
            const updateCart = await cartService.updateCart(cid, products)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(updateCart)
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static addProductToCart = async (req, res, next) => {
        const { cid, pid } = req.params;
        try {
            const updatedCart = await cartService.addProductToCart(cid, pid);
            res.status(200).json(updatedCart);
        } catch (error) {
            req.logger.error(`Error en el agregado de productos: ${error.message}`)
            next(error)
        }
    }
    static addProductsToCart = async (req, res, next) => {
        const { cid } = req.params;
        const products = req.body.products
        try {
            if (!products || !Array.isArray(products) || products.length === 0) {
                return CustomError.createError("Error en la actualizadion del cart", "La lista de productos es inválida o está vacía", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            for (let product of products) {
                if (!mongoose.Types.ObjectId.isValid(product.product) || isNaN(product.quantity)) {
                    return CustomError.createError("Error en la actualizadion del cart", "Id invlado o cantidad invalida dede ser un numero", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
                }
            }
            const updatedCart = await cartService.addProductsToCart(cid, products);
            res.status(200).json(updatedCart);
        } catch (error) {
            req.logger.error(`Error en el agregado de productos: ${error.message}`)
            next(error)
        }
    }
    static removeProduct = async (req, res, next) => {
        let { cid, pid } = req.params
        try {
            let removeProduct = await cartService.removeProduct(cid, pid)
            req.logger.info(`Producto id ${pid} eliminado del cart ${cid}`)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(removeProduct)
        } catch (error) {
            req.logger.error(`Error en el servido. No se ha podido eliminar ${pid} del cart ${cid}`)
            next(error)
        }
    }
    static removeAllProduct = async (req, res, next) => {
        let { cid } = req.params
        try {
            let removeProducts = await cartService.removeAllProducts(cid)
            req.logger.info(`Productos eliminados del cart ${cid}: Cart vacio`)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(removeProducts)
        } catch (error) {
            req.logger.error(`Error en el servidor. No se ha podido vaciado del cart ${cid}`)
            next(error)
        }
    }
    static purchase = async (req, res, next) => {
        const { cid } = req.params;
        try {
            const user = await userService.getBy({ cart: cid });
            if (!user.email) {
                return CustomError.createError("Error en el email", 'Email es necesario para enviar el ticket', TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS);
            }
            const result = await cartService.purchase(cid);
            if (!result) {
                return CustomError.createError("Error al completar la compra", `NO ES POSIBLE FINALIZAR LA COMPRA`, TIPOS_ERRORS.NOT_FOUND);
            }

            const mailOptions = {
                from: "gianellapena01@gmail.com",
                to: user.email,
                subject: "Ticket de compra",
                html: `
                TICKET DE COMPRA <hr>
                USUARIO: ${result.ticket.purchaser}<br>
                ID CART:${result.ticket._id}<br>
                Fecha:${result.ticket.purchase_datetime}<hr>
                TOTAL: ${result.ticket.amount}`
            };
            transporter.sendMail(mailOptions)
                .then(resultado => req.logger.info("Correo enviado: " + resultado.response))
                .catch(error => req.logger.error("Error al enviar correo: " + error.message));
            res.status(201).json({ ticket: result.ticket });
        } catch (error) {
            req.logger.error(`Error en finalización de la compra del cart ${cid}: ${error.message}`);
            next(error);
        }
    }
}
