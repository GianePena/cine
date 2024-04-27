
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
class ProductManager {
    constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1
    }

    getProducts() {
        const fileData = fs.readFileSync(this.path, 'utf-8');
        const products = JSON.parse(fileData);
        return products;
    }
    addProduct(title, category, description, price, thumbnail, code, stock, status) {
        if (this.products.some(product => product.code === code)) {
            console.log(`El código "${code}" ya existe, elige otro`);
            return;
        }
        const product = {
            title: title,
            category,
            description,
            price,
            thumbnail,
            code: Math.floor(Math.random() * 1000) + 1,
            stock,
            status,
            id: uuidv4()
        };

        if (title === "" || category === "" || description === "" || price === "" || thumbnail === "" || stock === "" || status === "") {
            console.error("Completar todos los campos");
            return;
        }
        try {
            const fileData = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(fileData);
        } catch (err) {
            console.error("Error al leer los datos del archivo:", err);
        }
        this.products.push(product);
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log(`"${title}" producto cargado con éxito`);
            return product;
        } catch (err) {
            console.error("Error al guardar los datos en el archivo:", err);
        }
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
        const idString = String(id);
        const filteredProducts = this.products.filter(product => product.id !== idString);
        this.products = filteredProducts;
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        console.log(`Producto eliminado: ID ${idString}`);
    }
}

/*



productManager.addProduct("KunFu Panda 4", "basdasdad", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290", 125, 40)
productManager.addProduct("Duna", "sadasda", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9259ce8559aa01f8fd771054cd3a1a28.jpg?v=00002290", 132, 40)
productManager.addProduct("Pobres criaturas", "cxcxcc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9a7859e6ed1c4fb77bf24248a679946b.jpg?v=00002290", 98, 40)
productManager.updateProduct(1, 4500)
const productos = productManager.getProduct()



let lectura = JSON.parse(fs.readFileSync("./src/productos.json", { encoding: "utf-8" }))
console.log(lectura[2].title);

{
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
                "title": "KunFu Panda 4",
                "category": "animacion",
                "description": "basdasdad",
                "price": 4500,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290",
                "code": 111,
                "stock": 40,
                "status": false,
                "id": 4
            },
            {
                "title": "KunFu Panda 4",
                "category": "animacion",
                "description": "basdasdad",
                "price": 4500,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290",
                "code": 111,
                "stock": 40,
                "status": false,
                "id": 4
            },
            {
                "title": "KunFu Panda 4",
                "category": "animacion",
                "description": "basdasdad",
                "price": 4500,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290",
                "code": 111,
                "stock": 40,
                "status": false,
                "id": 4
            },
            {
                "title": "Con todos menos contigo",
                "category": "comedia",
                "description": "grsdfsf",
                "price": 3000,
                "thumbnail": "https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c0ccd93727b38f.jpg?v=00002290",
                "code": 13,
                "stock": 40,
                "status": false,
                "id": 2
            }

*/
export default ProductManager