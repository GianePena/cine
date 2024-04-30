
import fs from "fs";
import { productModelo } from "./models/productModelo.js";
import { v4 as uuidv4 } from 'uuid';
class ProductManagerMONGO {
    /*constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1
    }*/

    async getProducts() {
        /*const fileData = fs.readFileSync(this.path, 'utf-8');
        const products = JSON.parse(fileData);
        return products;*/
        return await productModelo.find()
    }
    async addProduct(product) {
        return await productModelo.create()
        /*addProduct(title, category, description, price, thumbnail, code, stock, status) {
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
    } las validaciones se realizan en el router y despues e pasan aun controlador*/
    }
    async getProductsBy(filter) {   // filtro= {email:"diego@test.com", edad:40}
        return await productModelo.findOne({ filter })
    }
    async getProductById(id) {
        return await productModelo.findById({ id })
    }
    /*getProductById(id) {
        let product = this.products.filter(product => product.id === id)
        if (product) {
            return product
        }
        else {
            return console.error("Not found")
        } --> pasar al router
    }*/
    async updateProduct(id) {
        return await productModelo.findByIdAndUpdate(id)
        /*
        const productId = this.products.findIndex(product => product.id === id);
        if (productId === -1) {
            return console.error("Producto no encontrado");
        }
        this.products[productId].price = price;
        console.log(`Producto actualizado: ID ${id}, Precio ${price}`);
        fs.writeFileSync(this.path, JSON.stringify(this.products));*/
    }
    async deleteProduct(id) {
        return await productModelo.deleteOne({ _id: id })
        /*const fileData = fs.readFileSync(this.path, 'utf-8');
        this.products = JSON.parse(fileData);

        const productIndex = this.products.findIndex(product => product.id === id);
        this.products.splice(productIndex, 1);
        console.log(`Producto con ID ${id} eliminado con éxito.`);

        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));*/
    }


}
/*


const filteredProducts = this.products.filter(product => product.id !== idString);
        this.products = filteredProducts;
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        console.log(`Producto eliminado: ID ${idString}`);
productManager.addProduct("KunFu Panda 4", "basdasdad", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290", 125, 40)
productManager.addProduct("Duna", "sadasda", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9259ce8559aa01f8fd771054cd3a1a28.jpg?v=00002290", 132, 40)
productManager.addProduct("Pobres criaturas", "cxcxcc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9a7859e6ed1c4fb77bf24248a679946b.jpg?v=00002290", 98, 40)
productManager.updateProduct(1, 4500)
const productos = productManager.getProduct()



let lectura = JSON.parse(fs.readFileSync("./src/productos.json", { encoding: "utf-8" }))
console.log(lectura[2].title);

*/
export { ProductManagerMONGO }
