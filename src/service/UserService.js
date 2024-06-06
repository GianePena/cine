import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"

class UserService {
    constructor(dao) {
        this.dao = dao
    }
}

export const userService = new UserService(new UserManager())