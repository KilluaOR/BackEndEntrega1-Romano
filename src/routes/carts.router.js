import { Router } from "express";
import {
  addProductToCartControllers,
  createCartControllers,
  getCartByIdControllers,
  deleteProductFromCartControllers,
  updateProductQuantityInCartControllers,
  deleteAllProductsFromCartControllers,
  updateAllProductsInCartControllers,
} from "../controllers/carts.controllers.js";

const router = Router();

router.post("/", createCartControllers);

router.get("/:cid", getCartByIdControllers);

router.post("/:cid/product/:pid", addProductToCartControllers);

router.delete("/:cid/products/:pid", deleteProductFromCartControllers);

router.put("/:cid", updateAllProductsInCartControllers);

router.put("/:cid/products/:pid", updateProductQuantityInCartControllers);

router.delete("/:cid", deleteAllProductsFromCartControllers);

export default router;
