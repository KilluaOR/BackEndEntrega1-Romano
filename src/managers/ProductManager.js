import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      status: true,
      ...products,
    };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }
}

export default ProductManager;
