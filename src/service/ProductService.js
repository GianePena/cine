
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
    getProductBy = async (filter) => {
        return this.dao.getProductBy(filter)
    }
    createProduct = async (title, category, description, price, thumbnail, stock, status) => {
        return this.dao.createProduct({ title, category, description, price, thumbnail, stock, status })
    }
    updateProduct = async (id, price) => {
        return this.dao.updateProduct(id, price)
    }
    deleteProduct = async (id) => {
        return this.dao.deleteProduct(id)
    }

}

export const productService = new ProductService(new ProductManager())