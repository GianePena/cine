import fs from "fs";
import { cartModelo } from "./models/cartModelo.js";

class CartManagerMONGO {
    /*constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1;
    }*/
    async getCartProducts() {
        return await cartModelo.find()
    }
    async addCartProduct(product, quantity) {
        const newCartProduct = {
            products: [{
                product: {
                    title
                },
                quantity,
            }]
        };
        return await cartModelo.create(newCartProduct);
    }

}
export { CartManagerMONGO }


