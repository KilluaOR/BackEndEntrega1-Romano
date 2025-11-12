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

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    //Validación básica
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ error: "No se recibieron campos para actualizar" });
    }

    //Convierto el pid a num si los ids  son numéricos en el JSON.
    const idNum = isNaN(pid) ? pid : parseInt(pid);

    const result = await productManager.updateProduct(idNum, updatedFields);

    if (result && result.error) {
      return res.status(404).json(result);
    }

    return req.json({
      message: "Producto actualizado correctamente",
      product: result,
    });
  } catch (error) {
    console.error("PUT /:pid error:", error);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar producto" });
  }
});

export default router;
