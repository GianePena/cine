import { Router } from 'express';
import { ProductController } from '../controller/ProductController.js';

export const router = Router()

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductsById)
router.post("/", ProductController.addProducts);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct)
