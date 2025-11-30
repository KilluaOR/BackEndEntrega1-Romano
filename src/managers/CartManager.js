// import fs from "fs";

// class CartManager {
//   constructor(path) {
//     this.path = path;
//   }

//   async getCarts() {
//     if (!fs.existsSync(this.path)) return [];
//     try {
//       const data = await fs.promises.readFile(this.path, "utf-8");
//       const carts = JSON.parse(data);
//       return Array.isArray(carts) ? carts : [];
//     } catch {
//       return [];
//     }
//   }

//   async createCart() {
//     const carts = await this.getCarts();

//     const validCarts = carts.filter((c) => c && c.id !== undefined);

//     const newId = validCarts.length
//       ? Math.max(...validCarts.map((c) => Number(c.id))) + 1
//       : 1;

//     const newCart = { id: newId, products: [] };
//     carts.push(newCart);
//     await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
//     return newCart;
//   }

//   async getCartById(cid) {
//     const carts = await this.getCarts(); //lee el archivo de carritos.
//     const cart = carts.find((c) => Number(c.id) === Number(cid));
//     return cart || null;
//   }

//   async addProductToCart(cid, pid) {
//     const carts = await this.getCarts();
//     const cartIndex = carts.findIndex((c) => Number(c.id) === Number(cid)); //Busco el carrito con el id.

//     if (cartIndex === -1) {
//       return { error: `Carrito con id ${cid} no encontrado` };
//     }

//     const cart = carts[cartIndex];
//     const existingProduct = cart.products.find(
//       (p) => Number(p.product) === Number(pid)
//     );

//     if (existingProduct) {
//       //Si el prod. ya está en el carrito, incrementa su cantidad.
//       existingProduct.quantity += 1;
//     } else {
//       //Si no existe lo agrega con cantidad inicial 1.
//       cart.products.push({ product: Number(pid), quantity: 1 });
//     }

//     //Guardo los cambios.
//     await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

//     return cart;
//   }
// }

// export default CartManager;

import { cartModel } from "../models/cart.model.js";

export default class CartManager {
  async getCarts() {
    return await cartModel.find().populate("products.product");
  }

  async createCart() {
    const newCart = await cartModel.create({ products: [] });
    return newCart;
  }

  async getCartById(cid) {
    return await cartModel.findById(cid).populate("products.product");
  }

  async addProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return { error: `Carrito con id ${cid} no encontrado` };
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
}
