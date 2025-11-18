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

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/productsList", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const productsJson = JSON.stringify(products || []);
    res.render("productsList", { products: products || [], productsJson });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("productsList", { products: [], productsJson: "[]" });
  }
});

export default router;
