
import { productModelo } from "./models/productModelo.js";
import { userModelo } from "./models/userModelo.js";

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
    async createProduct({ owner, title, category, description, price, thumbnail, stock, status }) {
        let userEmail = "admin";
        if (owner) {
            let user = await userModelo.findOne({ email: owner });
            if (user) {
                userEmail = user.email;
            }
        }
        return await productModelo.create({ owner: userEmail, title, category, description, price, thumbnail, stock, status })
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById(id)
    }
    async updateProduct(email, id, price) {
        let user = await userModelo.findOne({ email: email });
        let product = await this.getProductById(id)
        if (product.owner === user.email) {
            product.price = price
            console.log("SOLO EL OWNER PUEDE ELIMIAR EL PRODUCOT");
            product.save();
            console.log(`NUEVO PRECIO : ${product.price}`);
            return await productModelo.updateOne({ _id: id }, { price: price })
        }
        else {
            console.log(`privilegios insuficientes para modifica rel producto ${id}: solo usuarios premium o propietarios`);
        }
    }
    async deleteProduct(email, id) {
        let user = await userModelo.findOne({ email: email });
        let product = await this.getProductById(id)
        if (user.rol === "admin" || product.owner === user.email) {
            console.log(`producto eliminado con exito: ${product.title}`);
            return await productModelo.deleteOne({ _id: id });

        } else {
            console.log(`Privilegios insuficientes para eliminar el producto ${id}: solo usuarios premium o propietarios`);
        }
    }
}

export { ProductManagerMONGO }
