import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager("./src/managers/data/carts.json");

export const createCartControllers = async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
};

export const getCartByIdControllers = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno al obtener carrito" });
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
    console.error("Error al agregar produto al carrito:", error);
    res.status(500).json({ error: "Error interno al agregar producto" });
  }
};
