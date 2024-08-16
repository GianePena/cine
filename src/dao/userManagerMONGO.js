import { userModelo } from "./models/userModelo.js";

class UserManagerMONGO {
    async getUsers() {
        return await userModelo.find()
    }
    async getUserById(uid) {
        return await userModelo.findById(uid)
    }
    async getBy(filtro) {
        return await userModelo.findOne(filtro).lean();
    }
    async getUserBy(filtro) {
        return await userModelo.findOne(filtro)
    }
    async getUserCartBy(filtro) {
        return await userModelo.findOne(filtro)
    }
    async createUser(user) {
        return await userModelo.create(user)
    }
    async updateUser(user) {
        user.save()
        return user
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
