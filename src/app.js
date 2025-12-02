import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductsModel from "./models/product.model.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

//Archivos estáticos.
app.use(express.static(path.join(__dirname, "public")));

//Handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//SERVER + SOCKET.IO
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Hacer io disponible en las rutas
app.set("io", io);

//Eventos del websocket.

io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");

  //Enviar productos.
  const products = await ProductsModel.find().lean();
  socket.emit("productos", products);

  //Cuando se crea un producto desde realtime
  socket.on("nuevoProducto", async (product) => {
    await ProductsModel.create(product);
    const updatedproducts = await ProductsModel.find().lean(); //.lean() pide un objeto plano, limpio tipo JSON.
    io.emit("productos", updatedproducts);
  });

  //Eliminar prod. desde socket
  socket.on("eliminarProducto", async (id) => {
    await ProductsModel.findByIdAndDelete(id);
    const updatedProducts = await ProductsModel.find().lean();
    io.emit("productos", updatedProducts);
  });
});

// Iniciar servidor (después de la conexión a la DB)
httpServer.listen(PORT, () => {
  console.log(`🚀 ~ express.listen ~ servidor corriendo en el puerto ${PORT}`);
});
