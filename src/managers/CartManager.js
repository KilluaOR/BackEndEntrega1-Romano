import CartModel from "../models/cart.model.js";

export default class CartManager {
  async getCarts() {
    return await CartModel.find().populate("products.product");
  }

  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  async getCartById(cid) {
    return await CartModel.findById(cid).populate("products.product");
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
    }

    const product = await ProductsModel.findById(pid);
    if (!product) {
      return { error: `Producto con id ${pid} no encontrado` };
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async deleteProduct(cid, pid) {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex === -1) {
      return { error: `Producto con id ${pid} no está en el carrito` };
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (!productInCart) {
      return { error: `Producto con id ${pid} no está en el carrito` };
    }

    productInCart.quantity = quantity;
    await cart.save();

    return cart;
  }

  async updateAllProducts(cid, products) {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
    }

    if (!Array.isArray(products)) {
      return { error: "Los productos deben ser un arreglo" };
    }

    cart.products = products;
    await cart.save();

    return cart;
  }

  async deleteAllProducts(cid) {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
    }

    cart.products = [];
    await cart.save();

    return cart;
  }
}
