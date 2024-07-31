
import { Router } from 'express';
import { ProductController } from '../controller/ProductController.js';
import { passportCall } from '../utils/utils.js';
import { authorization } from '../middleware/auth.js'
export const router = Router()



router.get("/", ProductController.getProducts);
router.get("/all", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductsById)
router.post("/", passportCall("jwt"), authorization(["admin", "premium"]), ProductController.addProduct);
router.put("/:id", passportCall("jwt"), authorization(["premium"]), ProductController.updateProduct);
router.delete("/:id", passportCall("jwt"), authorization(["admin", "premium"]), ProductController.deleteProduct)

