import { productModelo } from "./models/productModelo.js";

class ProductManagerMONGO {
    async getProducts() {
        return await productModelo.find().lean()
    }
    async getProductsPaginate(page, limit, sort) {
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
        return await productModelo.paginate({}, options)
    }
    async createProduct({ owner, title, category, description, price, thumbnail, stock, status }) {
        return await productModelo.create({ owner, title, category, description, price, thumbnail, stock, status })
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById(id)
    }
    async updateProduct(product) {
        await product.save();
        return product
    }
    async deleteProduct(product) {
        await productModelo.deleteOne({ _id: product._id });
    }
}


export { ProductManagerMONGO }





