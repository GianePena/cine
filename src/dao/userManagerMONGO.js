import { userModelo } from "./models/userModelo.js";

import { generaHash } from "../utils/utils.js";
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
    async updatePassword(email, password) {
        let user = await userModelo.findOne({ email: email });
        if (!user) {
            throw new Error("Carrito no encontrado");
        }
        if (user.password === password) {
            throw new Error("Contraseña usada: Introducir una nueva contraseña");
        }
        user.password = generaHash(password);
        await user.save()
        return user
    }
    async delete(id) {
        return await userModelo.deleteOne({ _id: id })
    }

}

export { UserManagerMONGO }
