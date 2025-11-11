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
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`El campo "${field}" es obligatorio`);
      }
    }
    const newId = products.length
      ? Math.max(...products.map((p) => Number(p.id))) + 1
      : 1;

    const newProduct = {
      id: newId,
      status: product.status !== undefined ? product.status : true,
      thumbnails: product.thumbnails || [],
      ...product,
    };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }
}

getProductById(id);

export default ProductManager;
