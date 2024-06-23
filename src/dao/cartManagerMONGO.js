
import { cartModelo } from "./models/cartModelo.js";
import { ticketModelo } from "./models/ticketModelo.js";
import { userModelo } from "./models/userModelo.js";
import { productModelo } from "./models/productModelo.js";

class CartManagerMONGO {
    async getAll() {
        return await cartModelo.find();
    }
    async getCartById(id) {
        return await cartModelo.findById(id).populate('products.product').lean();
    }
    async create(products, username) {
        return await cartModelo.create({
            products: products,
            username: username
        })
    }
    async updateQuantity(cid, pid, quantity) {
        let cart = await this.getCartById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado")
        }
        cart.products.forEach(p => {
            if (p.product._id.toString() === pid) {
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
        const finalProducts = cartToUpdate.products.concat(products)
        cartToUpdate.products = finalProducts
        return await cart.save();
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
    async createTicket(amount, purchaser) {
        const newTicket = new ticketModelo({ amount, purchaser });
        return await newTicket.save();
    }
    /*async findUserByCartId(cid) {
        return await userModelo.findOne({ cart: cid });
    }*/
    async findUserBy(filtro) {
        return await userModelo.findOne({ filtro });
    }
    async updateProductStock(productId, quantity) {
        return await productModelo.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
    }

}



export { CartManagerMONGO }

