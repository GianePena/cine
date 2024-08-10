
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
class ProductManagerMEMORY {
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
        const fileData = fs.readFileSync(this.path, 'utf-8');
        this.products = JSON.parse(fileData);

        const productIndex = this.products.findIndex(product => product.id === id);
        this.products.splice(productIndex, 1);
        console.log(`Producto con ID ${id} eliminado con éxito.`);

        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }


}

export { ProductManagerMEMORY }