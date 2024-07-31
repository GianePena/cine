import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"
class UserService {
    constructor(dao) {
        this.dao = dao
    }
    getAllUsers = async () => {
        return this.dao.getUsers()
    }
    getUserById = async (id) => {
        return this.dao.getUserById(id);
    }
    getUserBy = async (filtro) => {
        return this.dao.getBy(filtro)
    }
    createUser = async () => {
        return this.dao.createUser()
    }
    updateUserRol = async (uid, rol) => {
        return this.dao.updateUserRol(uid, rol)
    }
    updateUserPassword = async (email, password) => {
        return this.dao.updatePassword(email, password)
    }
    deleteUser = async (id) => {
        return this.dao.delete(id)
    }
}

export const userService = new UserService(new UserManager())



