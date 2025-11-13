import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "path";
import viewsRouter from "./routes/products.router.js";

const app = express();
const PORT = 8080;

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//SOCKET.IO
// export const io = new Server

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views engine", "handlebars");
app.set("views", __dirname + "./src/views");
app.use(express.static(__dirname + "/views"));

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
