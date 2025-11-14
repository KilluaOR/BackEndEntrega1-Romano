import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

//Para usar rutas absolutas sin romper nada.
const __dirname = path.resolve();

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

//Archivos estáticos.
app.use(express.static(path.join(__dirname, "/public")));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//SOCKET.IO
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Cliente conectado por WebSocket");

  //Cuando se crea un producto desde realtime
  socket.on("nuevoProducto", async (product) => {
    console.log("Producto recibido por WS:", product);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
