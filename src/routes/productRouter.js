
import { Router } from 'express';
import { ProductController } from '../controller/ProductController.js';
import { passportCall } from '../utils/utils.js';
import { authorization } from '../middleware/authorize.js';
export const router = Router()



router.get("/", ProductController.getProducts);
router.get("/all", ProductController.getAllProducts);
router.get("/:pid", ProductController.getProductsById)

router.post("/", passportCall("jwt"), authorization(["admin", "premium"]), ProductController.addProduct);

router.put("/:pid", passportCall("jwt"), authorization(["premium"]), ProductController.updateProduct);

router.delete("/:pid", passportCall("jwt"), authorization(["admin", "premium"]), ProductController.deleteProduct)


