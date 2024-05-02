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
/*
const cartManager = new CartManager(("./src/api/cart.json"))
cartManager.addProductCart("Producto 1", 2);
cartManager.addProductCart("Producto 2", 1);
cartManager.addProductCart("Producto 3", 5);
console.log(cartManager.getProduct());*/
export { CartManagerMONGO }


