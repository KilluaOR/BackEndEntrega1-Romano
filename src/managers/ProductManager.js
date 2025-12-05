import ProductsModel from "../models/product.model.js";

export default class ProductManager {
  async getProducts() {
    return await ProductsModel.find().lean();
  }

  async addProduct(product) {
    try {
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "stock",
        "category",
      ];

      const missingFields = requiredFields.filter((field) => !product[field]);
      if (missingFields.length > 0) {
        return {
          error: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
        };
      }

      const codeExists = await ProductsModel.findOne({ code: product.code });
      if (codeExists) {
        return {
          error: `El código "${product.code}" ya existe. Debe ser único.`,
        };
      }

      const newProduct = await ProductsModel.create({
        status: product.status !== undefined ? product.status : true,
        thumbnails: product.thumbnails || [],
        ...product,
      });

      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductsModel.findById(id).lean();
      return product || null;
    } catch (err) {
      return null; // si el id no tiene formato válido, que no rompa
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      delete updatedFields.id; // No permitir cambiar _id

      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      ).lean();

      if (!updatedProduct) {
        return { error: `Producto con id ${id} no encontrado` };
      }

      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductsModel.findByIdAndDelete(id).lean();

      if (!deletedProduct) {
        return { error: `Producto con id ${id} no encontrado` };
      }

      return deletedProduct;
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}
