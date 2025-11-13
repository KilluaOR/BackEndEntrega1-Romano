import { Router } from "express";
import {
  addProductToCartControllers,
  createCartControllers,
  getCartByIdControllers,
} from "../controllers/carts.controllers.js";

const router = Router();

router.post("/", createCartControllers);

router.get("/:cid", getCartByIdControllers);

router.post("/:cid/product/:pid", addProductToCartControllers);

export default router;
