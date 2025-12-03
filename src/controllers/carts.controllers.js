import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager();

export const getCartByIdControllers = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json({ status: "sucess", payload: cart });
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
