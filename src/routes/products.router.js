import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import {
  addProductControllers,
  deleteProductsControllers,
  getProductsByIdControllers,
  getProductsControllers,
  updateProductControllers,
} from "../controllers/products.controllers.js";

const router = Router(); //Mini servidor q maneja las rutas de productos.
const productManager = new ProductManager("./src/managers/data/products.json");

router.get("/", getProductsControllers);

router.post("/", addProductControllers);

router.get("/:pid", getProductsByIdControllers);

router.put("/:pid", updateProductControllers);

router.delete("/:pid", deleteProductsControllers);

export default router;
