import { Router } from "express";
import {
  addProductToCartControllers,
  createCartControllers,
  getCartByIdControllers,
  deleteProductFromCartControllers,
} from "../controllers/carts.controllers.js";

const router = Router();

router.post("/", createCartControllers);

router.get("/:cid", getCartByIdControllers);

router.post("/:cid/product/:pid", addProductToCartControllers);

router.delete("/:cid/products/:pid", deleteProductFromCartControllers);

export default router;
