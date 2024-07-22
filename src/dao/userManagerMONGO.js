import { userModelo } from "./models/userModelo.js";

class UserManagerMONGO {
    async getUsers() {
        return await userModelo.find()
    }
    async getById(id) {
        return await userModelo.findById(id)
    }

    async getBy(filtro = {}) {
        return await userModelo.findOne(filtro)
    }
    async createUser(user) {
        return await userModelo.create(user)
    }
    async updateUserRol(uid, rol) {
        let user = await userModelo.findById(uid)
        user.rol = rol
        user.save()
    }
    async updatePassword() {

    }
    /*
    async updateCart(uid, cid) {
        const user = await userModelo.findById(uid);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (!user.cart || !mongoose.Types.ObjectId.isValid(user.cart)) {
            user.cart = new mongoose.Types.ObjectId(cid);
        } else {
            throw new Error('El usuario ya tiene un carrito asignado');
        }
        await user.save();
        return user;
    }*/
    async delete(id) {
        return await userModelo.deleteOne({ _id: id })
    }

}

export { UserManagerMONGO }
