import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }
  async getCarts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    try {
      const carts = JSON.parse(data);
      return Array.isArray(carts) ? carts : [];
    } catch {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const validCarts = carts.filter((c) => c && c.id !== undefined);

    const newId = validCarts.length
      ? Math.max(...validCarts.map((c) => Number(c.id))) + 1
      : 1;

    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }
}
export default CartManager;
