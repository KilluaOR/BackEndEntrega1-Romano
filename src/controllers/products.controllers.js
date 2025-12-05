import mongoose from "mongoose";
import ProductsModel from "../models/product.model.js";

export const getProductsControllers = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    let filter = {};
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else if (query) {
      filter.category = query;
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      sort: sortOption,
    };

    const result = await ProductsModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno al obtener productos",
    });
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

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

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
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
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

    const deleted = await ProductsModel.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

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
