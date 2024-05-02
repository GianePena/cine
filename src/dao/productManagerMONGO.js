
import { productModelo } from "./models/productModelo.js";

import { v4 as uuidv4 } from 'uuid';
class ProductManagerMONGO {
    /*constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1
    }*/

    async getProducts() {
        return await productModelo.find()
    }
    async addProduct(product) {
        return await productModelo.create(product)
    }
    async getProductsBy(filter) {
        return await productModelo.findOne({ filter })
    }
    async getProductById(id) {
        return await productModelo.findById({ id })
    }
    async updateProduct(id) {
        return await productModelo.findByIdAndUpdate(id)
    }
    async deleteProduct(id) {
        return await productModelo.deleteOne({ _id: id })
    }


}

export { ProductManagerMONGO }
