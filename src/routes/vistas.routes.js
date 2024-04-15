import { Router } from "express"
import ProductManager from "../productManager.js"

export const router = Router()

const productManager = new ProductManager()

router.get('/peliculas', (req, res) => {
    let products = productManager.getProducts()
    console.log(products);
    res.setHeader(`Content-Type`, `text/html`)
    res.status(200).render('index', { products })
})

router.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realTimeProducts')
})