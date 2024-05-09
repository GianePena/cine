import { Router, query } from 'express';
import { ProductManagerMONGO as ProductManager } from "../dao/productManagerMONGO.js"
import { isValidObjectId } from 'mongoose';
export const router = Router()

const productManager = new ProductManager();

router.get("/", async (req, res) => {

    let { limit, page, category, title, stock, sort, available } = req.query;
    limit = limit ? Number(limit) : 10;
    page = page ? Number(page) : 1;
    try {
        if (category || title) {
            const filter = {};
            if (category) {
                filter.category = category;
            }
            if (title && stock > 0) {
                filter.title = title;
            }
            if (available) {
                filter.stock = { $gt: 0 };
            }
            const products = await productManager.getProductsBy(filter);
            return res.status(200).json(products);
        } else {

            const { docs: products, totalDocs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPaginate(page, limit, sort);
            return res.status(200).json({
                products,
                totalDocs,
                totalPages,
                page,
                limit,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                linkPrevPage: prevPage ? `?limit=${limit}&page=${prevPage}` : null,
                linkNextPage: nextPage ? `?limit=${limit}&page=${nextPage}` : null
            });
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
    }
});
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
    const { title, category, description, price, thumbnail, stock, status } = req.body;
    console.log(`Received data - title: ${title}, category: ${category}, description: ${description}, price: ${price}, thumbnail: ${thumbnail}, stock: ${stock}, status: ${status}`);
    if (!title || !category || !description || !price || !thumbnail || !stock || !status) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({ error: "completar la totalidad de los campos" })
    }
    let existingProduct
    try {
        existingProduct = await productManager.getProductsBy({ title })
    } catch (error) {
        res.setHeader('Content-type', 'application/json')
        return res.status(500).json({ error: "Error en el servdior" })
    }
    if (existingProduct) {
        res.setHeader('Content-type', 'application/json')
        return res.status(400).json({ error: `El producto con ${title} ya existe` })
    }
    try {
        let newProduct = await productManager.addProduct({ title, category, description, price, thumbnail, stock, status })
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
