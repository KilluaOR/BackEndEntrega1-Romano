import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.on("request", () => {
  console.log("Solicitud recibida");
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
