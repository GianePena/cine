import { Router } from 'express';
import { ProductManagerMONGO as ProductManager } from "../dao/productManagerMONGO.js"
import { isValidObjectId } from 'mongoose';
export const router = Router()

const productManager = new ProductManager("./api/products.json");
//agregar cambiar por los cambios del manager
/*router.get("/", (req, res) => {
    let products = productManager.getProducts()
    let limit = req.query.limit;
    if (limit) {
        limit = Number(limit)
        products = products.slice(0, limit)
    }
    res.json(products)
})*/
router.get("/", async (req, res) => {
    try {
        let products = await productManager.getProducts()
        let limit = req.query.limit;
        if (limit) {
            limit = Number(limit)
            products = products.slice(0, limit)
        }
        res.json(products)
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: `Error en el servidor`
            }
        )
    }

})
router.get("/:id", async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ingrese un id valido" })
    }
    try {
        let product = await productManager.getProductById({ _id: id })
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(product)
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: `Error en el servidor`
            }
        )
    }

})

router.post("/", async (req, res) => {
    const { title, category, description, price, thumbnail, code, stock, status, id } = req.body;
    if (!title || !category || !description || !price || !thumbnail || !stock || !status) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({ error: "completar la totalidad de los campos" })
    }
    let existingProduct
    try {
        existingProduct = await productManager.getProductsBy({ title })//{}tiene funcion de filtro
    } catch (error) {
        res.setHeader('Content-type', 'application/json')
        return res.status(500).json({ error: "Error en el servdior" })
    }
    if (existingProduct) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({ error: `El producto con ${title} ya existe` })
    }
    try {
        let newProduct = await productManager.addProduct({ title, category, description, price, thumbnail, code, stock, status })
        res.setHeader('Content-type', 'application/json')
        return res.status(200).json({ newProduct })
    } catch (error) {
        res.setHeader('Content-type', 'application/json')
        return res.status(500).json({ error: "Error en el servdior" })
    }

});

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let { price } = req.body;
    if (!isValidObjectId(id)) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json(error + "Ingrese un id valido")
    }
    try {
        let updatedProduct = await productManager.updateProduct(id, price);
        res.setHeader('Content-type', 'application/json')
        res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.setHeader('Content-type', 'application/json')
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json(error + "Ingrese un id valido")
    }
    try {
        const wasDeleted = await productManager.deleteProduct(id)
        if (wasDeleted) {
            res.setHeader('Content-type', 'application/json')
            return res.status(200).json({ message: `Producto con ID ${id} eliminado correctamente` })
        }
    } catch (error) {
        console.log(error)
        res.setHeader('Content-type', 'application/json')
        return res.status(500).json({ error: "Error no se ha encontrado el producto" })
            ;
    }

})
