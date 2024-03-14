

class ProductManager {
    constructor(tilte, description, price, thumbnail, code, stock) {
        this.tilte = tilte,
            this.description = description,
            this.price = price,
            this.thumbnail = thumbnail,
            this.code = code,
            this.stock = stock,
            this.products = [],
            this.id = 1
    }

    getProduct() {
        return this.products;
    }


    addProduct(title, description, price, thumbnail, code, stock) {
        if (title == undefined || description == undefined || price == undefined || thumbnail == undefined || code == undefined || stock == undefined) {
            console.log("Completar la totalida de los campos")
            return
        }
        if (this.products.some(product => product.code === code)) {
            console.log(`El codigo "${code}" ya existe, elige otro`)
        }

        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.id++
        }

        this.products.push(newProduct)

        console.log(`"${title} "producto cargado con exito `)
    }
    getProductById(id) {
        if (this.products.find(product => product.id === id)) {
            return console.log(`el producto cuyo id es: "${id}"`)
        }
        else {
            return console.error("Not found")
        }
    }
}

const productManager = new ProductManager("./archivo.txt")

productManager.addProduct("Patos", "cxcxcxc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/eae343c50d05a3beb2532361519d2ecc.jpg?v=00002290", 111, 40)
productManager.addProduct("Con todos menos contigo", "grsdfsf", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c0ccd93727b38f.jpg?v=00002290", 143, 40)
productManager.addProduct("Madame web", "gdfgdg", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/c272d94125a7b844a7cd79859bf9db28.jpg?v=00002290", 122, 40)
productManager.addProduct("KunFu Panda 4", "basdasdad", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290", 125, 40)
productManager.addProduct("Duna", "sadasda", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9259ce8559aa01f8fd771054cd3a1a28.jpg?v=00002290", 132, 40)
productManager.addProduct("Pobres criaturas", "cxcxcc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9a7859e6ed1c4fb77bf24248a679946b.jpg?v=00002290", 98, 40)
const productos = productManager.getProduct()
console.log("Listado de peliculas:", productos)