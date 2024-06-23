export class userDTO {
    constructor(user) {
        this.firstName = user.first_name,
            this.lastName = user.last_name,
            this.email = user.email,
            this.age = user.age,
            this.cart = user.cart,
            this.rol = user.rol
    }
}