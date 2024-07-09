import { CartDTO } from "../DTO/CartDTO.js"
import { cartService } from "../service/CartService.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";

export class CartController {
    static getCarts = async (req, res, next) => {
        try {
            let carts = await cartService.getCarts()
            let cartDTO = carts.map(c => new CartDTO(c))
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ cartDTO })
        } catch (error) {
            req.logger.error(`Error fetching all carts: ${error.message}`)
            next(error)
        }
    }
    static getCartById = async (req, res, next) => {
        try {
            const { id } = req.params
            let cart = await cartService.getCartById(id)
            req.logger.debug(`id recibido ${id}`)
            req.logger.info(cart)
            if (!cart) {
                return CustomError.createError("Cart NotFound Error", `Cart con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(new CartDTO(cart));
        } catch (error) {
            req.logger.error(`Error fetching cart by ID ${id}: ${error.message}`)
            next(error);
        }
    }

    static createCart = async (req, res, next) => {
        const { uid } = req.params;
        const { products } = req.body;
        console.log(uid, products);
        try {
            if (!uid || !products) {
                req.logger.warn('Datos incompletos necesarios para producto');
                req.logger.debug(`Datos recibidos: ${uid, products}`);
                return CustomError.createError("Faltante de datos", ` "Completar el ID del usuario (uid)`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }

            if (!products || products.length === 0) {
                req.logger.warn('Datos incompletos necesarios para producto');
                req.logger.debug(`Datos recibidos: ${uid, products}`);
                return CustomError.createError("Faltante de datos", " Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            for (const product of products) {
                if (isNaN(product.quantity)) {
                    return CustomError.createError(
                        "Datos incorrectos",
                        "La cantidad de los productos debe ser un número",
                        TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
                    );
                }
            }
            const newCart = await cartService.createCart(uid, products);
            req.logger.info(`Cart creado exitosamente: ${newCart}`)
            res.status(201).json({ newCart });
        } catch (error) {
            req.logger.error(`Error en la creacion de un nuevo cart: ${error.message}`)
            next(error)
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
            let updateproduct = await cartService.updateQuantity(cid, pid, quantity)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ updateproduct })
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static updateCart = async (req, res, next) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            if (!products) {
                return CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const updateCart = await cartService.updateCart(cid, products)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(new CartDTO(updateCart))
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static addProductsToCart = async (req, res, next) => {
        const { cid } = req.params;
        const products = req.body.products
        try {
            if (!products) {
                return CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const updatedCart = await cartService.addProductsToCart(cid, products);
            res.status(200).json({ message: 'Productos agregados con éxito', updatedCart });
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
            res.status(201).json(`Producto eliminado con exito: ${pid}`)
        } catch (error) {
            req.logger.error(`Error en la eliminacion del product ID${pid} del cart ${cid}: ${error.message}`)
            next(error)
        }
    }
    static removeAllProduct = async (req, res, next) => {
        let { cid } = req.params
        try {
            let removeProducts = await cartService.removeAllProducts(cid)
            req.logger.info(`Productos eliminados del cart ${cid}: Cart vacio`)
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(`Cart ${cid} productos eliminados con exito`)
        } catch (error) {
            req.logger.error(`Error en el vaciado del cart ${cid}: ${error.message}`)
            next(error)

        }
    }
    static purchase = async (req, res, next) => {
        const { cid } = req.params;
        try {
            const result = await cartService.purchase(cid);
            if (result.error) {
                return CustomError.createError("Error al completar la compra", `NO ES POSIBLE FINLIZAR LA COMPRA`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.status(201).json({ ticket: result.ticket });
        } catch (error) {
            req.logger.error(`Error en finalizalizacion de la compra del cart ${cid}: ${error.message}`)
            next(error)
        }
    }
}


