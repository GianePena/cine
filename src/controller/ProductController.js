import mongoose from "mongoose";
import { productService } from "../service/ProductService.js";
export class ProductController {
    static getProducts = async (req, res) => {
        let { limit, page, category, title, stock, sort, available } = req.query;
        limit = limit ? Number(limit) : 10;
        page = page ? Number(page) : 1;
        try {
            if (category || title) {
                const filter = {};
                if (category) {
                    filter.category = category;
                }
                if (title && stock > 0) {
                    filter.title = title;
                }
                if (available) {
                    filter.stock = { $gt: 0 };
                }
                const products = await productService.getProductBy(filter)
                return res.status(200).json(products);
            } else {
                const { docs: products, totalDocs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPaginate(page, limit, sort);
                return res.status(200).json({
                    products,
                    totalDocs,
                    totalPages,
                    page,
                    limit,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    linkPrevPage: prevPage ? `?limit=${limit}&page=${prevPage}` : null,
                    linkNextPage: nextPage ? `?limit=${limit}&page=${nextPage}` : null
                });
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static getProductsById = async (req, res) => {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "ingrese un id valido" })
        }
        try {
            let product = await productService.getProductById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(product)
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static addProducts = async (req, res) => {
        const { title, category, description, price, thumbnail, stock, status } = req.body;
        if (!title || !category || !description || !price || !thumbnail || !stock || !status) {
            res.setHeader('Content-type', 'application/json')
            return res.status(400).json({ error: "completar la totalidad de los campos" })
        }
        let existingProduct
        try {
            existingProduct = await productService.getProductBy({ title })
            if (existingProduct) {
                res.setHeader('Content-type', 'application/json')
                return res.status(400).json({ error: `El producto con ${title} ya existe` })
            }
        } catch (error) {
            res.setHeader('Content-type', 'application/json')
            return res.status(500).json({ error: "Error en el servdior" })
        }
        try {
            let newProduct = await productService.createProduct({ title, category, description, price, thumbnail, stock, status })
            res.setHeader('Content-type', 'application/json')
            return res.status(201).json({ newProduct })
        } catch (error) {
            res.setHeader('Content-type', 'application/json')
            return res.status(500).json({ error: "Error en el servdior" })
        }
    }
    static updateProduct = async (req, res) => {
        let { id } = req.params;
        let { price } = req.body;
        if (!isValidObjectId(id)) {
            res.setHeader('Content-type', 'application/json')
            return res.status(400).json(error + "Ingrese un id valido")
        }
        try {
            let updatedProduct = await productService.updateProduct(id, price)
            res.setHeader('Content-type', 'application/json')
            res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
        } catch (error) {
            console.error(error);
            res.setHeader('Content-type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }
    static deleteProduct = async (req, res) => {
        let { id } = req.params
        if (!isValidObjectId) {
            res.setHeader('Content-type', 'application/json')
            return res.status(400).json(error + "Ingrese un id valido")
        }
        try {
            const wasDeleted = await productService.deleteProduct(id)
            if (wasDeleted) {
                res.setHeader('Content-type', 'application/json')
                return res.status(204).json({ message: `Producto con ID ${id} eliminado correctamente` })
            }
        } catch (error) {
            console.log(error)
            res.setHeader('Content-type', 'application/json')
            res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
        }
    }

}