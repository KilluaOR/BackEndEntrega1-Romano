import mongoose from "mongoose";
import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager();

export const getCartByIdControllers = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(400).json({ error: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno al obtener carrito" });
  }
};

export const createCartControllers = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno al crear carrito" });
  }
};

export const addProductToCartControllers = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID del producto inválido" });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (updatedCart.error) {
      return res.status(404).json(updatedCart);
    }

    res.json({
      message: "Producto agregado correctamente al carrito",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno al agregar producto" });
  }
};

export const deleteProductFromCartControllers = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID del producto inválido" });
    }

    const result = await cartManager.deleteProduct(cid, pid);

    if (result?.error) {
      return res.status(404).json(result);
    }

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      cart: result,
    });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};

export const updateProductQuantityInCartControllers = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "ID del producto inválido" });
    }

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser un número mayor a 0" });
    }

    const result = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (result?.error) {
      return res.status(404).json(result);
    }

    res.json({
      status: "success",
      message: "Cantidad actualizada correctamente",
      cart: result,
    });
  } catch (error) {
    console.error("Error interno al actualizar cantidad:", error);
    res.status(500).json({ error: "Error interno al actualizar cantidad" });
  }
};

export const deleteAllProductsFromCartControllers = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    const result = await cartManager.deleteAllProducts(cid);

    if (result?.error) {
      return res.status(404).json(result);
    }

    res.json({
      status: "success",
      message: "Todos los productos fueron eliminados del carrito",
      cart: result,
    });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res.status(500).json({ error: "Error interno al eliminar productos" });
  }
};

export const updateAllProductsInCartControllers = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID del carrito inválido" });
    }

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        error: "Se debe enviar un arreglo de productos en el body",
      });
    }

    const result = await cartManager.updateAllProducts(cid, products);

    if (result?.error) {
      return res.status(404).json(result);
    }

    res.json({
      status: "success",
      message: "Productos del carrito actualizados correctamente",
      cart: result,
    });
  } catch (error) {
    console.error("Error al actualizar productos del carrito:", error);
    res.status(500).json({ error: "Error interno al actualizar productos" });
  }
};
