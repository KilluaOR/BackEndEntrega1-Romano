import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router(); //Mini servidor q maneja las rutas de productos.
const productManager = new ProductManager("./src/managers/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);

    if (addedProduct.error) {
      return res.status(400).json(addedProduct);
    }

    res.status(201).json(addedProduct);
  } catch (error) {
    console.error("Error en POST /:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
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

    return res.json({
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

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const idNum = isNaN(pid) ? pid : parseInt(pid);

    const result = await productManager.deleteProduct(idNum);

    if (result && result.error) {
      return res.status(404).json(result);
    }

    res.json({
      message: "Producto eliminado correctamente",
      deleted: result,
    });
  } catch (error) {
    console.error("DELETE /:pid error:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
});

export default router;
