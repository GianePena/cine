
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
    createProduct = async ({ owner, title, category, description, price, thumbnail, stock, status }) => {
        return this.dao.createProduct({ owner, title, category, description, price, thumbnail, stock, status })
    }
    updateProduct = async (id, email, price) => {
        return this.dao.updateProduct(id, email, price);
    }
    deleteProduct = async (email, pid) => {
        return this.dao.deleteProduct(email, pid);
    }

}

export const productService = new ProductService(new ProductManager())