import { ProductDTO } from "../DTO/ProductDTO.js";
import { productService } from "../service/ProductService.js";
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { argumentosProducts } from "../utils/erroresProducts.js";

export class ProductController {
    static getAllProducts = async (req, res, next) => {
        try {
            let products = await productService.getProducts()
            let productDto = products.map(p => new ProductDTO(p))
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ productDto })
        } catch (error) {
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
            next(error);
        }
    }
    static addProduct = async (req, res, next) => {
        const { title, category, description, price, thumbnail, stock, status } = req.body;
        try {
            const datosIncompletos = argumentosProducts({ title, category, description, price, thumbnail, stock, status });
            if (datosIncompletos !== "Todos los datos están completos.") {
                return CustomError.createError("Faltante de datos", datosIncompletos, "Completar la totalidad de los campos para ejecutar la creación del producto", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS);
            }
            let newProduct = await productService.createProduct(product);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct });
        } catch (error) {
            next(error);
        }
    }
    static updateProduct = async (req, res, next) => {
        const { id } = req.params;
        const { price } = req.body;
        if (isNaN(price) || price < 0) {
            return CustomError.createError("Datos incorrectos", " El precio debe ser un número", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
        }
        try {
            const updatedProduct = await productService.updateProduct(id, price);
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
            console.log(updatedProduct);
        } catch (error) {
            next(error)
        }
    }
    static deleteProduct = async (req, res, next) => {
        let { id } = req.params
        try {
            const product = await productService.deleteProduct(id)
            if (!product) {
                return CustomError.createError("Product NotFound Error", `Producto con ID ${id} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.setHeader('Content-type', 'application/json')
            return res.status(204).json({ message: `Producto con ID ${id} eliminado correctamente` })
        } catch (error) {
            next(error)
        }
    }

}