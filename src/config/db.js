import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env de la raíz del proyecto primero
dotenv.config({ path: path.join(__dirname, "../.env") });
// También cargar src/.env si existe (por compatibilidad)
dotenv.config({ path: path.join(__dirname, "../src/.env") });

const connectDB = async () => {
  try {
    // Usar MONGO_URI del .env o fallback a la base de datos local
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/backend-db";
    
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado con éxito a:", mongoUri.replace(/\/\/.*@/, "//***@"));
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
