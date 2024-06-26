import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"

class CartService {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async () => {
        const carts = await this.dao.getAll()
        if (carts.length > 0) {
            return carts
        }
        else {
            throw new Error("Carts vacio");
        }
    }
    getCartById = async (id) => {
        const cart = await this.dao.getCartById(id)
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        return this.dao.getCartById(id)
    }
    createCart = async (uid, products) => {
        const newCart = await this.dao.create(uid, products)
        return newCart;
    }
    addProductsToCart = async (cid, products) => {
        return this.dao.addProductsToCart(cid, products);
    }
    updateQuantity = async (cid, pid, quantity) => {
        return this.dao.updateQuantity(cid, pid, quantity)
    }
    updateCart = async (cid, products) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado")
        }
        const updateCart = await this.dao.updateCart(cid, products)
        return updateCart
    }
    removeProduct = async (cid, pid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado")
        }
        const updateCart = await this.dao.removeProduct(cid, pid)
        return updateCart
    }
    removeAllProducts = async (cid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado")
        }
        const updateCart = await this.dao.removeAllProducts(cid)
        return updateCart
    }
    purchase = async (cid) => {
        const cart = await this.dao.getCartById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        let insufficientStock = [];
        let totalAmount = 0;
        for (let item of cart.products) {
            const { product, quantity } = item;
            if (product.stock < quantity) {
                insufficientStock.push(product._id);
            } else {
                totalAmount += product.price * quantity;
            }
        }
        if (insufficientStock.length > 0) {
            return { error: "Stock insuficiente", insufficientStock };
        }
        const user = await this.dao.findUserByCartId(cid)
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const ticket = await this.dao.createTicket(totalAmount, user.email);

        for (let item of cart.products) {
            await this.dao.updateProductStock(item.product._id, item.quantity)
        }
        await this.dao.removeAllProducts(cart);
        return { ticket };
    }
}

export const cartService = new CartService(new CartManager())