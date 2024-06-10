import { Router } from 'express';

import { CartController } from '../controller/CartController.js';

export const router = Router()

router.get("/", CartController.getCarts)
router.get("/:id", CartController.getCartById);
router.delete(("/:cid"), CartController.removeAllProduct)
router.post("/", CartController.createCart);
router.put(("/:cid"), CartController.updateCart)//deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
router.put(("/:cid/products/:pid"), CartController.updateQuantity)// deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.delete(("/:cid/products/:pid"), CartController.removeProduct)// deberá eliminar del carrito el producto seleccionado.