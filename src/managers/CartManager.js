import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }
  async getCarts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.patj, "utf-8");
    return JSON.parse(data);
  }
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }
}
export default CartManager;
