
import { ProductManagerMONGO as ProductManager } from "../DAO/productManagerMONGO.js";
import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
class ProductService {
    constructor(dao) {
        this.productManager = new ProductManager(),
            this.userManager = new UserManager()
    }
    getProducts = async () => {
        return this.productManager.getProducts()
    }
    getProductById = async (id) => {
        return this.productManager.getProductById(id)
    }
    getFilteredProducts = async ({ limit, page, category, title, stock, sort, available }) => {
        limit = limit ? Number(limit) : 10;
        page = page ? Number(page) : 1;
        const filter = {};
        if (category) {
            filter.category = category
        }
        if (title) {
            filter.title = title
        }
        if (available) {
            filter.stock = { $gt: 0 };
        }
        if (category || title) {
            return this.productManager.getProductBy(filter);
        } else {
            return this.productManager.getProductsPaginate(page, limit, sort);
        }
    }
    getProductBy = async (filter) => {
        return this.productManager.getProductsBy(filter)
    }
    createProduct = async ({ owner, title, category, description, price, thumbnail, stock, status }) => {
        if (owner) {
            let ownerIsUser = await this.userManager.getBy({ email: owner })
            if (ownerIsUser) {
                owner = ownerIsUser.email;
            }
            else {
                owner = "admin"
            }
        }
        return this.productManager.createProduct({ owner, title, category, description, price, thumbnail, stock, status })
    }
    updateProduct = async (pid, email, price) => {
        let user = await this.userManager.getUserBy({ email: email })
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.productManager.getProductById(pid)
        if (!product) {
            logger.warn(`Producto con ${id} no encintrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Producto con ID ${pid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (product.owner === user.email) {
            product.price = price
            const updatedProduct = await this.productManager.updateProduct(product);
            return updatedProduct;
        }
        return product
    }
    deleteProduct = async (email, pid) => {
        let user = await this.userManager.getUserBy({ email: email })
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        let product = await this.productManager.getProductById(pid)
        if (!product) {
            logger.warn(`Producto con ${pid} no encintrado`)
            return CustomError.createError(
                "Error al actualizar el producto", `Producto con ID ${pid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (user.rol === "admin" || product.owner === user.email) {
            this.productManager.deleteProduct(product);
        }
        else {
            logger.warn(`privilegios insuficientes para modifica el producto ${pid}: solo usuarios premium o propietarios`)
        }
    }

}

export const productService = new ProductService()