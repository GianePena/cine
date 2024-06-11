
import { productModelo } from "./models/productModelo.js";

class ProductManagerMONGO {
    async getProducts() {
        return await productModelo.find().lean()
    }
    //PAGINATE
    async getProductsPaginate(page, limit, sort) { //agregar
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
        return await productModelo.paginate({}, options) //2 argumentos: filtro
    }//DEVUELVE UN OBJETO CON PROPIEDADES DOCS (ARRAY CON DOCUMENTOS), TOTAL DOC, LIMITE, ....
    async createProduct(product) {
        return await productModelo.create(product)
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById(id)
    }
    async updateProduct(id, price) {
        let product = await this.getProductById(id)
        product.price = price
        product.save();
        return await productModelo.updateOne({ _id: id }, { price: price })
    }
    async deleteProduct(id) {
        return await productModelo.deleteOne({ _id: id })
    }
}

export { ProductManagerMONGO }
