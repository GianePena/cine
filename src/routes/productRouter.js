import { Router } from 'express';
import { ProductController } from '../controller/ProductController.js';

export const router = Router()

router.get("/", ProductController.getProducts);
router.get("/all", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductsById)
router.post("/", ProductController.addProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct)
