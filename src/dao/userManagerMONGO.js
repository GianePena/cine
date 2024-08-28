import { userModelo } from "./models/userModelo.js";

class UserManagerMONGO {
    async getUsers(filtro = {}) {
        return await userModelo.find(filtro)
    }
    async getUserById(uid) {
        return await userModelo.findById(uid)
    }
    async getBy(filtro) {
        return await userModelo.findOne(filtro).lean();
    }
    async createUser(user) {
        return await userModelo.create(user)
    }
    async getUserBy(filtro) {
        return await userModelo.findOne(filtro)
    }
    async updateUser(user) {
        await user.save()
        return user
    }
    async getUserCartBy(filtro) {
        return await userModelo.findOne(filtro)
    }
    async addCartToUser(user, cart) {
        user.cart = cart._id
        await user.save()
        return cart
    }
    async delete(user) {
        await userModelo.deleteOne({ _id: user._id });
    }

}

export { UserManagerMONGO }
