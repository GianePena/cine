

import { productModelo } from "./models/productModelo.js";
import { userModelo } from "./models/userModelo.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js"


class ProductManagerMONGO {
    async getProducts() {
        return await productModelo.find().lean()
    }
    //PAGINATE
    async getProductsPaginate(page, limit, sort) { //agregar
        const options = {
            page: page,
            limit: limit,
            lean: true,
        };
        if (sort) {
            options.sort = {
                'price': sort,
            }
        }
        return await productModelo.paginate({}, options) //2 argumentos: filtro
    }//DEVUELVE UN OBJETO CON PROPIEDADES DOCS (ARRAY CON DOCUMENTOS), TOTAL DOC, LIMITE, ....
    async createProduct({ owner, title, category, description, price, thumbnail, stock, status }) {
        if (owner) {
            let user = await userModelo.findOne({ email: owner });
            if (user) {
                owner = user.email;
            }
            else {
                owner = "admin"
            }
        }
        else {
            owner = "admin"
        }
        return await productModelo.create({ owner, title, category, description, price, thumbnail, stock, status })
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById(id).lean()
    }
    async updateProduct(id, email, price) {
        let user = await userModelo.findOne({ email: email });
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.getProductById(id)
        if (!product) {
            logger.warn(`Producto con ${id} no encintrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Producto con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (product.owner === user.email) {
            product.price = price
            product.save
            logger.info(`Precio acualizado:${product.title} ${product.price}`)
            return product
        }
        else {
            logger.warn(`privilegios insuficientes para modifica el producto ${id}: solo usuarios premium o propietarios`)
        }
    }
    async deleteProduct(email, id) {
        let user = await userModelo.findOne({ email: email });
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.getProductById(id).lean()
        if (!product) {
            logger.warn(`Producto con ${id} no encintrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Producto con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (user.rol === "admin" || product.owner === user.email) {
            logger.info(`producto eliminado con exito: ${product.title}`)
            return await productModelo.deleteOne({ _id: id });
        } else {
            logger.warn(`privilegios insuficientes para modifica el producto ${id}: solo usuarios premium o propietarios`)
        }
    }
}


export { ProductManagerMONGO }