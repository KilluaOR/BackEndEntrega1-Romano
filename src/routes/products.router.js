import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router(); //Mini servidor q maneja las rutas de productos.
const productManager = new ProductManager("../src/data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
  console.log("hola");
});

router.post("/", async (req, res) => {
  const newProduct = req.body.file;
  const addedProduct = await productManager.addProduct(newProduct);
  res.status(201).json(addedProduct);
});

export default router;
