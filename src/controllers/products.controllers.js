// import path from "path";
// import ProductManager from "../managers/ProductManager.js";

// const __dirname = path.resolve();
// const productManager = new ProductManager(
//   path.join(__dirname, "src/managers/data/products.json")
// );

// export const getProductsControllers = async (req, res) => {
//   try {
//     const products = await productManager.getProducts();
//     res.json(products);
//   } catch (error) {
//     console.error("Error al obtener productos:", error);
//     res.status(500).json({ error: "Error interno al obtener productos" });
//   }
// };

// export const addProductControllers = async (req, res) => {
//   try {
//     const newProduct = req.body;
//     const addedProduct = await productManager.addProduct(newProduct);

//     if (addedProduct.error) {
//       return res.status(400).json(addedProduct);
//     }

//     // Emitir evento de socket.io para actualizar la vista en tiempo real
//     const io = req.app.get("io");
//     if (io) {
//       const products = await productManager.getProducts();
//       io.emit("productos", products);
//       console.log("Producto agregado por POST - Emitidos productos:", products);
//     }

//     res.status(201).json(addedProduct);
//   } catch (error) {
//     console.error("Error en POST /:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

// export const getProductsByIdControllers = async (req, res) => {
//   const { pid } = req.params;
//   const product = await productManager.getProductById(pid);

//   if (!product) {
//     return res.status(404).json({ error: "Producto no encontrado" });
//   }
//   res.json(product);
// };

// export const updateProductControllers = async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const updatedFields = req.body;

//     //Validación básica
//     if (!updatedFields || Object.keys(updatedFields).length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No se recibieron campos para actualizar" });
//     }

//     //Convierto el pid a num si los ids  son numéricos en el JSON.
//     const idNum = isNaN(pid) ? pid : parseInt(pid);

//     const result = await productManager.updateProduct(idNum, updatedFields);

//     if (result && result.error) {
//       return res.status(404).json(result);
//     }
//     // Emitir evento de socket.io para actualizar la vista
//     const io = req.app.get("io");
//     if (io) {
//       const products = await productManager.getProducts();
//       io.emit("productos", products);
//       console.log(
//         "Producto actualizado por PUT - Emitidos productos:",
//         products
//       );
//     }

//     return res.json({
//       message: "Producto actualizado correctamente",
//       product: result,
//     });
//   } catch (error) {
//     console.error("PUT /:pid error:", error);
//     return res
//       .status(500)
//       .json({ error: "Error interno al actualizar producto" });
//   }
// };

// export const deleteProductsControllers = async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const idNum = isNaN(pid) ? pid : parseInt(pid);

//     const result = await productManager.deleteProduct(idNum);

//     if (result && result.error) {
//       return res.status(404).json(result);
//     }

//     // Emitir evento de socket.io para actualizar la vista en tiempo real
//     const io = req.app.get("io");
//     if (io) {
//       const products = await productManager.getProducts();
//       io.emit("productos", products);
//       console.log(
//         "Producto eliminado por DELETE - Emitidos productos:",
//         products
//       );
//     }

//     res.json({
//       message: "Producto eliminado correctamente",
//       deleted: result,
//     });
//   } catch (error) {
//     console.error("DELETE /:pid error:", error);
//     res.status(500).json({ error: "Error interno al eliminar producto" });
//   }
// };

import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

export const getProductsControllers = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
};

export const addProductControllers = async (req, res) => {
  try {
    const newProductData = req.body;

    const addedProduct = await productManager.addProduct(newProductData);

    if (addedProduct.error) {
      return res.status(400).json(addedProduct);
    }

    // Emitir actualización por WebSocket
    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("productos", products);
    }

    res.status(201).json(addedProduct);
  } catch (error) {
    console.error("Error en POST /:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProductsByIdControllers = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
};

export const updateProductControllers = async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ error: "No se recibieron campos para actualizar" });
    }

    const result = await productManager.updateProduct(pid, updatedFields);

    if (result?.error) {
      return res.status(404).json(result);
    }

    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("productos", products);
    }

    res.json({
      message: "Producto actualizado correctamente",
      product: result,
    });
  } catch (error) {
    console.error("PUT /:pid error:", error);
    res.status(500).json({ error: "Error interno al actualizar producto" });
  }
};

export const deleteProductsControllers = async (req, res) => {
  try {
    const { pid } = req.params;

    const result = await productManager.deleteProduct(pid);

    if (result?.error) {
      return res.status(404).json(result);
    }

    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("productos", products);
    }

    res.json({
      message: "Producto eliminado correctamente",
      deleted: result,
    });
  } catch (error) {
    console.error("DELETE /:pid error:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};
