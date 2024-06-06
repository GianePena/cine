
import { cartModelo } from "./models/cartModelo.js";
class CartManagerMONGO {
    async getCarts() {
        return await cartModelo.find();
    }
    async getCartById(id) {
        return await cartModelo.findById(id).populate('products.product').lean();
    }
    async createCart(products, username, country) {
        return await cartModelo.create({
            products: products,
            username: username,
            country: country
        })
    }
    async updateQuantity(cid, pid, quantity) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products.forEach(p => {
            if (p.product._id.toString() === pid) {
                console.log('entro al')
                p.quantity = quantity;
            }
        });
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate)
    }
    async updateCart(cid, products) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        console.log(cartToUpdate);
        const finalProducts = cartToUpdate.products.concat(products)
        console.log('finalProducts', finalProducts)
        cartToUpdate.products = finalProducts
        console.log(cartToUpdate);
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate)
    }
    async removeProduct(cid, pid) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products = cartToUpdate.products.filter(p => p.product._id.toString() != pid);
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate);

    }
    async removeAllProducts(cid) {
        let cartToUpdate = await this.getCartById(cid)
        if (!cartToUpdate) {
            throw new Error("Carrito no encontrado")
        }
        cartToUpdate.products = []
        return await cartModelo.updateOne({ _id: cid }, cartToUpdate)
    }

}



export { CartManagerMONGO }

