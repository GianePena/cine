import fs from "fs";

class ProductManager {
    constructor(path) {
        this.path = path,
            this.products = [{
                "title": "Patos",
                "category": "animacion",
                "description": "cxcxcxc",
                "price": 4500,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/eae343c50d05a3beb2532361519d2ecc.jpg?v=00002290",
                "code": 111,
                "stock": 40,
                "status": false,
                "id": 1
            },
            {
                "title": "Con todos menos contigo",
                "category": "comedia",
                "description": "grsdfsf",
                "price": 3000,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c0ccd93727b38f.jpg?v=00002290",
                "code": 143,
                "stock": 40,
                "status": false,
                "id": 2
            }],
            this.id = 1
    }
    getProducts() {
        return this.products;
    }
    addProduct(title, category, description, price, thumbnail, code, stock, status) {
        if (title == undefined || category == undefined || description == undefined || price == undefined || thumbnail == undefined || code == undefined || stock == undefined) {
            console.log("Completar la totalida de los campos")
            return
        }
        if (this.products.some(product => product.code === code)) {
            console.log(`El codigo "${code}" ya existe, elige otro`)
        }

        const newProduct = {
            title,
            category,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            id: this.id++
        }

        this.products.push(newProduct)

        console.log(`"${title} "producto cargado con exito `)

        fs.writeFileSync(this.path, JSON.stringify(this.products))

    }
    getProductById(id) {
        let product = this.products.filter(product => product.id === id)
        if (product) {
            return product
        }
        else {
            return console.error("Not found")
        }
    }
    updateProduct(id, price) {
        const productId = this.products.findIndex(product => product.id === id);
        if (productId === -1) {
            return console.error("Producto no encontrado");
        }
        this.products[productId].price = price;
        console.log(`Producto actualizado: ID ${id}, Precio ${price}`);
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
    deleteProduct(id) {
        const buscarProducto = this.products.findIndex(products => products.id == id)
        const deleteProducto = this.products.splice(buscarProducto, 1)
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        console.log(`El producto eliminado es ${id}`, deleteProducto)
    }


}

/*


productManager.addProduct("Patos", "cxcxcxc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/eae343c50d05a3beb2532361519d2ecc.jpg?v=00002290", 111, 40)
productManager.addProduct("Con todos menos contigo", "grsdfsf", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c0ccd93727b38f.jpg?v=00002290", 143, 40)
productManager.addProduct("Madame web", "gdfgdg", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/c272d94125a7b844a7cd79859bf9db28.jpg?v=00002290", 122, 40)
productManager.addProduct("KunFu Panda 4", "basdasdad", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290", 125, 40)
productManager.addProduct("Duna", "sadasda", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9259ce8559aa01f8fd771054cd3a1a28.jpg?v=00002290", 132, 40)
productManager.addProduct("Pobres criaturas", "cxcxcc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9a7859e6ed1c4fb77bf24248a679946b.jpg?v=00002290", 98, 40)
productManager.updateProduct(1, 4500)
const productos = productManager.getProduct()



let lectura = JSON.parse(fs.readFileSync("./src/productos.json", { encoding: "utf-8" }))
console.log(lectura[2].title);

*/
export default ProductManager