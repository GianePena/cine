import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js"

class CartService {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async () => {
        return this.dao.getAll()
    }
    createCart = async (cart) => {
        return this.dao.create(cart)
    }
}

export const cartService = new CartService(new CartManager())