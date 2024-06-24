import { ProductDTO } from "../DTO/ProductDTO.js";
import { productService } from "../service/ProductService.js";
export class ProductController {
    static getAllProducts = async (req, res) => {
        try {
            let products = await productService.getProducts()
            let productDto = products.map(p => new ProductDTO(p))
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ productDto })
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getProducts = async (req, res) => {
        const { limit, page, category, title, stock, sort, available } = req.query;
        try {
            const result = await productService.getFilteredProducts({ limit, page, category, title, stock, sort, available });
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }

    static getProductsById = async (req, res) => {
        let { id } = req.params
        try {
            let product = await productService.getProductById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(new ProductDTO(product))
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static addProduct = async (req, res) => {
        const { title, category, description, price, thumbnail, stock, status } = req.body;
        try {
            let newProduct = await productService.createProduct(title, category, description, price, thumbnail, stock, status)
            res.setHeader('Content-type', 'application/json')
            return res.status(201).json({ newProduct })
        } catch (error) {
            res.setHeader('Content-type', 'application/json')
            return res.status(500).json({ error: "Error en el servdior" })
        }
    }
    static updateProduct = async (req, res) => {
        const { id } = req.params;
        const { price } = req.body;
        if (isNaN(price) || price < 0) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: 'Precio inválido.' });
        }
        try {
            const updatedProduct = await productService.updateProduct(id, price);
            /*if (!updatedProduct) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Producto con ID ${id} no encontrado.` });
            }*/
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
            console.log(updatedProduct);
        } catch (error) {
            console.error(error);
            res.setHeader('Content-type', 'application/json');
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }

    static deleteProduct = async (req, res) => {
        let { id } = req.params
        try {
            const wasDeleted = await productService.deleteProduct(id)
            /*if (wasDeleted) {
                res.setHeader('Content-type', 'application/json')
                return res.status(204).json({ message: `Producto con ID ${id} eliminado correctamente` })
            }*/
            res.setHeader('Content-type', 'application/json')
            return res.status(204).json({ message: `Producto con ID ${id} eliminado correctamente` })
        } catch (error) {
            console.log(error)
            res.setHeader('Content-type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }

}