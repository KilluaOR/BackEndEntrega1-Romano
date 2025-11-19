import path from "path";
import ProductManager from "../managers/ProductManager.js";

const __dirname = path.resolve();
const productManager = new ProductManager(
  path.join(__dirname, "src/managers/data/products.json")
);

export const viewsHomeController = async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
};

export const viewsRTPController = async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
};

export const viewsPLController = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("productsList", { products: products || [] });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("productsList", { products: [] });
  }
};
