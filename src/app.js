import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

//Para usar rutas absolutas sin romper nada.
const __dirname = path.resolve();

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

//Archivos estáticos.
app.use(express.static("src/public"));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//SOCKET.IO
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Hacer io disponible en las rutas
app.set("io", io);

//Manager para websockets.
const productManager = new ProductManager(
  path.join(__dirname, "src/managers/data/products.json")
);

//Eventos del websocket.

io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");

  //Enviar productos.
  socket.emit("productos", await productManager.getProducts());

  //Cuando se crea un producto desde realtime
  socket.on("nuevoProducto", async (product) => {
    await productManager.addProduct(product);
    io.emit("productos", await productManager.getProducts());
    console.log("Producto recibido por WS:", product);
  });

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("productos", await productManager.getProducts());
  });
});
