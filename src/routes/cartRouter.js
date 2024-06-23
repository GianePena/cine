import { Router } from 'express';
import { CartController } from '../controller/CartController.js';
import { passportCall } from '../utils.js';
import { authorization } from '../middleware/auth.js';


export const router = Router()

router.get("/", CartController.getCarts)
router.get("/:id", CartController.getCartById);
router.delete(("/:cid"), CartController.removeAllProduct)
router.post("/", CartController.createCart);
router.put(("/:cid"), passportCall("jwt"), authorization(["user"]), CartController.updateCart)
router.put(("/:cid/products/:pid"), passportCall("jwt"), authorization(["user"]), CartController.updateQuantity)// deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.delete(("/:cid/products/:pid"), passportCall("jwt"), authorization(["user"]), CartController.removeProduct)// deberá eliminar del carrito el producto seleccionado.


router.post("/:cid/purchase", passportCall("jwt"), authorization(["user"]), CartController.purchase)
