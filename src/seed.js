import mongoose from "mongoose";
import ProductsModel from "./models/product.model.js";
import CartModel from "./models/cart.model.js";

const MONGO_URL = "mongodb://localhost:27017/backEnd1";

// Conexión
mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("Conectado a MongoDB");

    // Limpio colecciones
    await ProductsModel.deleteMany({});
    await CartModel.deleteMany({});

    // Creo productos de prueba
    const products = await ProductsModel.insertMany([
      {
        title: "Zapatillas React",
        description: "Zapatillas deportivas",
        price: 50000,
        stock: 20,
        category: "calzado",
        code: "A1",
      },
      {
        title: "Remera Oversize",
        description: "Remera amplia de algodón",
        price: 15000,
        stock: 50,
        category: "ropa",
        code: "B2",
      },
      {
        title: "Gorra Negra",
        description: "Gorra estilo urbano",
        price: 12000,
        stock: 30,
        category: "accesorios",
        code: "C3",
      },
    ]);

    // Creo un carrito vacío
    const cart = await CartModel.create({ products: [] });

    console.log("Productos creados:", products.length);
    console.log("Carrito creado con ID:", cart._id);

    process.exit();
  })
  .catch((err) => {
    console.error("Error al conectar:", err);
  });
