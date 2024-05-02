import { Router } from "express"
export const router = Router()
import { ProductManagerMONGO as ProductManager } from "../dao/productManagerMONGO.js"

const productManager = new ProductManager("./api/products.json");


router.get('/products', (req, res) => {
    let products = productManager.getProducts()
    console.log(products);
    res.setHeader(`Content-Type`, `text/html`)
    res.status(200).render('index', { products })
})

router.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    res.status(200).render('chat');
});