import express from "express";
import productsRouter from "./routes/products.router";
import cartsRouter from "./routes/carts.router";

const app = express();
const PORT = 8080;

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extend: true })); //Interperta datos enviados por formularios.

// Rutas principales
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
