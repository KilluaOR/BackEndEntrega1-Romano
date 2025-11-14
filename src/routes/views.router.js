import { Router } from "express";
import path from "path";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const __dirname = path.resolve();
const productManager = new ProductManager(
  path.join(__dirname, "src/managers/data/products.json")
);

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
