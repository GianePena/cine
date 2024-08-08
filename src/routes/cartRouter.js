import { Router } from 'express';
import { CartController } from '../controller/CartController.js';
import { passportCall } from '../utils/utils.js';
import { authorization } from '../middleware/auth.js';


export const router = Router()

router.get("/", CartController.getCarts)
router.get("/:cid", passportCall("jwt"), authorization(["user", "premium"]), CartController.getCartById);

router.post("/", CartController.createCart);

router.put('/addProducts/:cid/products', passportCall("jwt"), authorization(["user", "premium"]), CartController.addProductsToCart)
router.put(("/:cid"), passportCall("jwt"), authorization(["user", "premium"]), CartController.updateCart)
router.put(("/:cid/products/:pid"), passportCall("jwt"), authorization(["user", "premium"]), CartController.updateQuantity)

router.delete(("/:cid/product/:pid"), passportCall("jwt"), authorization(["user", "premium"]), CartController.removeProduct)
router.delete("/:cid", CartController.removeAllProduct)

router.post("/:cid/purchase", passportCall("jwt"), authorization(["user", "premium"]), CartController.purchase)
