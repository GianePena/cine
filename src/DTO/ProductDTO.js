export class ProductDTO {
    constructor(product) {
        this.title = product.title,
            this.category = product.category,
            this.description = product.description,
            this.price = product.price,
            this.code = product.code,
            this.stock = product.stock,
            this.status = product.status,
            this.id = product.id
    }

}