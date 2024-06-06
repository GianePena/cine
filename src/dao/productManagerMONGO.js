
import { productModelo } from "./models/productModelo.js";
import { v4 as uuidv4 } from 'uuid';
class ProductManagerMONGO {
    /*constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1
    }*/

    async getProducts() {
        return await productModelo.find().lean()
    }
    //PAGINATE
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
        return await productModelo.paginate({}, options) //2 argumentos: filtro
    }//DEVUELVE UN OBJETO CON PROPIEDADES DOCS (ARRAY CON DOCUMENTOS), TOTAL DOC, LIMITE, ....
    async addProduct(product) {
        return (await productModelo.create(product))
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById({ id })
    }
    async updateProduct(id, price) {
        return await productModelo.findByIdAndUpdate(id, price)
    }
    async deleteProduct(id) {
        return await productModelo.deleteOne({ _id: id })
    }


}

export { ProductManagerMONGO }
