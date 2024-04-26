import fs from "fs";
class CartManager {
    constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1;
    }
    getCartProducts() {
        return this.products
    }
    addCartProduct(title, quantity) {
        const product = this.products.find(p => p.title == title)
        if (product) {
            product.quantity += quantity
        }
        const newProduct = {
            title,
            quantity,
            id: this.id++
        }
        this.products.push(newProduct)
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        fs.readFileSync(this.path, this.products)
    }
}
/*
const cartManager = new CartManager(("./src/api/cart.json"))
cartManager.addProductCart("Producto 1", 2);
cartManager.addProductCart("Producto 2", 1);
cartManager.addProductCart("Producto 3", 5);
console.log(cartManager.getProduct());*/

export default CartManager;

