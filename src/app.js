import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import mongoose from "mongoose";
import ProductsModel from "./models/product.model.js";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para manejar JSON.
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

//SOCKET.IO
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Hacer io disponible en las rutas
app.set("io", io);

//Manager para websockets.
const productManager = new ProductManager(
  path.join(__dirname, "managers/data/products.json")
);

//Eventos del websocket.

io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");

  //Enviar productos.
  socket.emit("productos", await productManager.getProducts());

  //Cuando se crea un producto desde realtime
  socket.on("nuevoProducto", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit("productos", products);
    console.log("Producto recibido por WebSocket:", product);
    console.log("Lista completa de productos después de agregar:", products);
  });

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("productos", await productManager.getProducts());
  });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/demo-db-1")
  .then(() => {
    console.log("🚀 ~ mongoose.connect ~ conectado a la base de datos");
    ProductsModel.create({ name: "Hola Compass, aparecé wachaaa" })
      .then(() => console.log("🟢 Documento creado en demo-db-1"))
      .catch((err) => console.log("❌ Error creando documento:", err));

    app.listen(PORT, () => {
      console.log(
        `🚀 ~ express.listen ~ servidor corriendo en el puerto ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });

mongoose.connection.once("open", () => {
  console.log("🌈 Conectado a Mongo desde Compass + Mongoose");
});
