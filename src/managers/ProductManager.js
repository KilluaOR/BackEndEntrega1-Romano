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

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => Number(p.id) === Number(id));
    return product || null;
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts(); //Traigo todos los productos.
      const index = products.findIndex((p) => p.id === id); //Busca en el array qué prod. tiene el id q pasamos, y devuelve la posiscion de el mismo.
      if (index === -1) {
        return { error: `Producto con id ${id} no encontrado` }; //Muestra error si no encuentra el prod.
      }

      //Evito que actualice el id si viene en el body.
      delete updatedFields.id;

      //Actualizo los campos que vinieron en el body.
      products[index] = { ...products[index], ...updatedFields };

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //Guardo el array actualizado.

      return products[index]; //Prod. actualizado.
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }
}

export default ProductManager;
