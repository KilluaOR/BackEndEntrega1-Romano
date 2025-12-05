import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import ProductsModel from "./models/product.model.js";
import CartModel from "./models/cart.model.js";

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env de la raíz del proyecto primero
dotenv.config({ path: path.join(__dirname, "../.env") });
// También cargar src/.env si existe (por compatibilidad)
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URL =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/backend-db";

// Función para limpiar la base de datos
export const clearDatabase = async () => {
  try {
    console.log(
      "Conectando a MongoDB:",
      MONGO_URL.replace(/\/\/.*@/, "//***@")
    );

    // Si no está conectado, conectar
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL);
      console.log("Conectado a MongoDB");
    }

    // Limpiar todas las colecciones
    const productsDeleted = await ProductsModel.deleteMany({});
    const cartsDeleted = await CartModel.deleteMany({});

    console.log(`✅ ${productsDeleted.deletedCount} productos eliminados`);
    console.log(`✅ ${cartsDeleted.deletedCount} carritos eliminados`);
    console.log("🧹 Base de datos limpiada completamente");

    return {
      productsDeleted: productsDeleted.deletedCount,
      cartsDeleted: cartsDeleted.deletedCount,
    };
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
    throw error;
  }
};

// Función para poblar la base de datos con datos de prueba
export const seedDatabase = async (clearExisting = true) => {
  try {
    console.log(
      "Conectando a MongoDB:",
      MONGO_URL.replace(/\/\/.*@/, "//***@")
    ); // Ocultar credenciales si las hay

    // Si no está conectado, conectar
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL);
      console.log("Conectado a MongoDB");
    }

    // Limpiar colecciones si se solicita
    if (clearExisting) {
      await ProductsModel.deleteMany({});
      await CartModel.deleteMany({});
      console.log("🧹 Colecciones limpiadas");
    }

    // Verificar si ya hay productos
    const existingProducts = await ProductsModel.countDocuments();
    if (existingProducts > 0 && !clearExisting) {
      console.log(
        `Ya existen ${existingProducts} productos. Para recrearlos, ejecuta con clearExisting=true`
      );
      return { products: existingProducts, created: false };
    }

    // Crear productos de prueba
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

    // Crear un carrito vacío (solo si se limpiaron las colecciones)
    if (clearExisting) {
      const cart = await CartModel.create({ products: [] });
      console.log("Carrito creado con ID:", cart._id);
    }

    console.log("✅ Productos creados:", products.length);
    return { products: products.length, created: true };
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
    throw error;
  }
};

// Si se ejecuta directamente (no como módulo), ejecutar el seed
// Verificar si este archivo es el punto de entrada principal
const isMainModule = process.argv[1] && process.argv[1].endsWith("seed.js");

if (isMainModule) {
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      await seedDatabase(true);
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error al conectar:", err);
      process.exit(1);
    });
}
