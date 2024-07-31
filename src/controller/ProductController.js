import { ProductDTO } from "../DTO/ProductDTO.js";
import { productService } from "../service/ProductService.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { argumentosProducts } from "../utils/erroresProducts.js";

export class ProductController {
    static getAllProducts = async (req, res, next) => {
        try {
            let products = await productService.getProducts()
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ products })

        } catch (error) {
            req.logger.error(`Error fetching all products: ${error.message}`)
            next(error)
        }
    }
    static getProducts = async (req, res, next) => {
        const { limit, page, category, title, stock, sort, available } = req.query;
        try {
            const result = await productService.getFilteredProducts({ limit, page, category, title, stock, sort, available });
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(result);
        } catch (error) {
            req.logger.error(`Error fetching product: ${error.message}`)
            next(error)
        }
    }
    static getProductsById = async (req, res, next) => {
        let { id } = req.params;
        try {
            let product = await productService.getProductById(id);
            if (!product) {
                return CustomError.createError("Not Found", ` Producto ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND);
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(new ProductDTO(product));
        } catch (error) {
            req.logger.error(`Error fetching product by ID ${id}: ${error.message}`)
            next(error);
        }
    }
    static addProduct = async (req, res, next) => {
        const { owner, title, category, description, price, thumbnail, stock, status } = req.body;
        try {
            const datosIncompletos = argumentosProducts({ owner, title, category, description, price, thumbnail, stock, status });
            if (datosIncompletos !== "Todos los datos están completos.") {
                req.logger.warn('Datos incompletos necesarios para producto');
                req.logger.debug(`Datos recibidos: ${title, category, description, price, thumbnail, stock, status}`);
                return CustomError.createError("Faltante de datos", datosIncompletos, "Completar la totalidad de los campos para ejecutar la creación del producto", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS);
            }
            let newProduct = await productService.createProduct({ owner, title, category, description, price, thumbnail, stock, status })
            req.logger.info(`Producto creado exitosamente: ${newProduct}`)
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct });
        } catch (error) {
            next(error);
            req.logger.error(`Error en la creacion de un nuevo producto: ${error.message}`)
        }
    }
    static updateProduct = async (req, res, next) => {
        let { id } = req.params;
        const { email, price } = req.body;
        if (isNaN(price) || price < 0) {
            return CustomError.createError("Datos incorrectos", " El precio dxebe ser un número", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
        }
        try {
            const updatedProduct = await productService.updateProduct(id, email, price);
            res.setHeader('Content-type', 'application/json');
            req.logger.info(`Producto modificado exitosamente: ${updatedProduct}`)
            res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
        } catch (error) {
            next(error)
            req.logger.error(`Error en la modificacion del product ID${id}: ${error.message}`)
        }
    }
    static deleteProduct = async (req, res, next) => {
        let { email } = req.body
        let { id } = req.params
        try {
            const product = await productService.deleteProduct(email, id)
            if (!product) {
                return CustomError.createError("Product NotFound Error", `Producto con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.setHeader('Content-type', 'application/json')
            return res.status(204).json({ message: `Producto con ID ${id} eliminado correctamente` })
        } catch (error) {
            next(error)
            req.logger.error(`Error en la eliminacion del producto ID${id}: ${error.message}`)
        }
    }

}
