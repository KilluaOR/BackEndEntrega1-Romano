import ProductsModel from "../models/products.model.js";

export const getProductsControllers = async (req, res) => {
  try {
    const products = await ProductsModel.find().lean();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
};

export const addProductControllers = async (req, res) => {
  try {
    const newProduct = await ProductsModel.create(req.body);

    const io = req.app.get("io");
    if (io) {
      const products = await ProductsModel.find().lean();
      io.emit("productos", products);
    }
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error en POST /:", error);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
};

export const getProductsByIdControllers = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductsModel.findById(pid).lean();

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

    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      pid,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    //Validación básica
    if (!updatedProduct) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }
    const io = req.app.get("io");
    if (io) {
      const products = await ProductsModel.find().lean();
      io.emit("productos", products);
    }
    res.json({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PUT /:pid error:", error);
    res.status(500).json({ error: "Error interno al actualizar producto" });
  }
};

export const deleteProductsControllers = async (req, res) => {
  try {
    const { pid } = req.params;

    const deleted = await ProductsModel.findByIdAndDelete(pid).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Emitir evento de socket.io para actualizar la vista en tiempo real
    const io = req.app.get("io");
    if (io) {
      const products = await ProductsModel.find().lean();
      io.emit("productos", products);
    }
    res.json({
      message: "Producto eliminado correctamente",
      deleted,
    });
  } catch (error) {
    console.error("DELETE /:pid error:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};
