import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"

class CartService {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async () => {
        return this.dao.getAll()
    }
    getCartById = async (id) => {
        return this.dao.getCartById(id)
    }
    createCart = async (products, username) => {
        return this.dao.create(products, username)
    }
    updateQuantity = async (cid, pid, quantity) => {
        return this.dao.updateQuantity(cid, pid, quantity)
    }
    updateCart = async (id, products) => {
        return this.dao.updateCart(id, products)
    }
    removeProduct = async (cid, pid) => {
        return this.dao.removeProduct(cid, pid)
    }
    removeAllProducts = async (cid) => {
        return this.dao.removeAllProducts(cid)
    }
}

export const cartService = new CartService(new CartManager())