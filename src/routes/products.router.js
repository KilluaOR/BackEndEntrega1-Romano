import { Router } from "express";
import {
  addProductControllers,
  deleteProductsControllers,
  getProductsByIdControllers,
  getProductsControllers,
  updateProductControllers,
} from "../controllers/products.controllers.js";

const router = Router(); //Mini servidor q maneja las rutas de productos.

router.get("/", getProductsControllers);

router.post("/", addProductControllers);

router.get("/:pid", getProductsByIdControllers);

router.put("/:pid", updateProductControllers);

router.delete("/:pid", deleteProductsControllers);

export default router;
