import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router(); //Mini servidor q maneja las rutas de productos.
const productManager = new ProductManager("./src/managers/data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  const addedProduct = await productManager.addProduct(newProduct);
  res.status(201).json(addedProduct);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});
export default router;
