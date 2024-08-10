import fs from "fs";

class CartManagerMEMORY {
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

export { CartManagerMEMORY };

