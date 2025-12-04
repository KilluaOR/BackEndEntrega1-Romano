import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductsModel from "./models/product.model.js";
import CartModel from "./models/cart.model.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/miDB",
      ttl: 14 * 24 * 60 * 60,
    }),
    secret: process.env.SESSION_SECRET || "miSecretoSuperSecreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

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

  try {
    //Enviar productos.
    const products = await ProductsModel.find().lean();
    socket.emit("productos", products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    socket.emit("error", { message: "Error al cargar productos" });
  }

  socket.on("addToCart", async ({ cartId, productId }) => {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return socket.emit("error", "Carrito no encontrado");

      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (index > -1) {
        cart.products[index].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      socket.emit("cartUpdated", cart); // devuelvo carrito actualizado
    } catch (error) {
      console.error(error);
      socket.emit("error", "No se pudo agregar el producto");
    }
  });

  //Cuando se crea un producto desde realtime
  socket.on("nuevoProducto", async (product) => {
    try {
      await ProductsModel.create(product);
      const updatedproducts = await ProductsModel.find().lean();
      io.emit("productos", updatedproducts);
    } catch (error) {
      console.error("Error al crear producto:", error);
      socket.emit("error", { message: "Error al crear producto" });
    }
  });

  //Eliminar prod. desde socket
  socket.on("eliminarProducto", async (id) => {
    try {
      await ProductsModel.findByIdAndDelete(id);
      const updatedProducts = await ProductsModel.find().lean();
      io.emit("productos", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("error", { message: "Error al eliminar producto" });
    }
  });
});

// Iniciar servidor (después de la conexión a la DB)
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 ~ express.listen ~ servidor corriendo en el puerto ${PORT}`
      );
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
