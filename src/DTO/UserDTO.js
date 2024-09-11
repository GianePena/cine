export class userDTO {
    constructor(user) {
        this.first_name = user.first_name,
            this.last_name = user.last_name,
            this.email = user.email,
            this.last_conection = user.last_conection,
            this.age = user.age,
            this.cart = user.cart,
            this.rol = user.rol,
            this.status = user.status,
            this._id = user._id
    }
}