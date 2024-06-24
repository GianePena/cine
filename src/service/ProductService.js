
import { ProductManagerMONGO as ProductManager } from "../DAO/productManagerMONGO.js";
class ProductService {
    constructor(dao) {
        this.dao = dao
    }
    getProducts = async () => {
        return this.dao.getProducts()
    }
    getProductById = async (id) => {
        return this.dao.getProductById(id)
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
            return this.dao.getProductBy(filter);
        } else {
            return this.dao.getProductsPaginate(page, limit, sort);
        }
    }
    getProductBy = async (filter) => {
        return this.dao.getProductBy(filter)
    }
    createProduct = async ({ title, category, description, price, thumbnail, stock, status }) => {
        return this.dao.createProduct({ title, category, description, price, thumbnail, stock, status })
    }
    updateProduct = async (id, price) => {
        if (isNaN(price) || price < 0) throw new Error('Precio inválido.');
        const updatedProduct = await this.dao.updateProduct(id, price);
        if (!updatedProduct) throw new Error(`Producto con ID ${id} no encontrado.`);
        return updatedProduct
    }
    deleteProduct = async (id) => {
        const wasDeleted = await this.dao.deleteProduct(id);
        if (!wasDeleted) throw new Error(`Producto con ID ${id} no encontrado.`);
        return wasDeleted;
    }

}

export const productService = new ProductService(new ProductManager())