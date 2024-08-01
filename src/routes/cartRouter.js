import { Router } from 'express';
import { CartController } from '../controller/CartController.js';
import { passportCall } from '../utils/utils.js';
import { authorization } from '../middleware/auth.js';


export const router = Router()

router.get("/", CartController.getCarts)
//router.get("/:cid", passportCall("jwt"), authorization(["user"]), CartController.getCartById);
router.get("/:cid", CartController.getCartById);
router.post("/:uid", CartController.createCart);
router.put('/addProducts/:cid/products', passportCall("jwt"), authorization(["user"]), CartController.addProductsToCart)
router.put(("/:cid"), passportCall("jwt"), authorization(["user"]), CartController.updateCart)
router.put(("/:cid/products/:pid"), passportCall("jwt"), authorization(["user"]), CartController.updateQuantity)
router.delete(("/:cid/product/:pid"), passportCall("jwt"), authorization(["user"]), CartController.removeProduct)
router.delete("/:cid", CartController.removeAllProduct)


router.post("/:cid/purchase", passportCall("jwt"), authorization(["user"]), CartController.purchase)
