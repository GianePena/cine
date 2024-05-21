import { userModelo } from "./models/userModelo.js";

class UserManagerMONGO {
    async getUsers() {
        return await userModelo.find()
    }
    async getById(id) {
        return await userModelo.findById(id)
    }
    async getBy(filtro = {}) {
        return await userModelo.findOne(filtro).lean()
    }
    async createUser(user) {
        return await userModelo.create(user)
    }
    async updateUserName(id, name) {
        let userExiste = await this.getById(id)
        if (!userExiste) {
            throw new Error("Usuario no encontrado")
        }
        userExiste.name = name
        return await userModelo.updateOne({ _id: id }, userExiste)
    }
    async deleteUser(id) {
        return await userModelo.deleteOne({ _id: id })
    }
}

export { UserManagerMONGO }
