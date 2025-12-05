import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductsModel from "./models/product.model.js";
import CartModel from "./models/cart.model.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const hbs = handlebars.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    multiply: (a, b) => a * b,
    cartTotal: (products) => {
      if (!products || !Array.isArray(products)) return 0;
      return products.reduce((total, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }, 0);
    },
    first: (array) => {
      if (!array || !Array.isArray(array) || array.length === 0) return "";
      return array[0];
    },
    eq: function (a, b) {
      if (a == null || b == null) return "";
      return String(a) === String(b) ? "selected" : "";
    },
  },
});

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/backend-db",
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

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", async (socket) => {

  try {
    const products = await ProductsModel.find().lean();
    socket.emit("productos", products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    socket.emit("error", { message: "Error al cargar productos" });
  }

  socket.on("addToCart", async ({ cartId, productId }) => {
    try {
      if (!cartId || !productId) {
        console.error("Faltan parámetros:", { cartId, productId });
        return socket.emit("error", "Faltan parámetros: cartId o productId");
      }

      // Verificar si el ID es válido
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        console.error("ID de carrito inválido:", cartId);
        return socket.emit("error", "ID de carrito inválido");
      }

      let cart = await CartModel.findById(cartId);
      if (!cart) {
        cart = await CartModel.create({ products: [] });
        socket.emit("newCartId", cart._id.toString());
      }

      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (index > -1) {
        cart.products[index].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      const currentCartId = cart._id.toString();

      const populatedCart = await CartModel.findById(currentCartId)
        .populate("products.product")
        .lean();

      socket.emit("cartUpdated", populatedCart);
      io.emit("cartUpdated:" + currentCartId, populatedCart);

      if (currentCartId !== cartId) {
        io.emit("cartUpdated:" + cartId, populatedCart);
      }
    } catch (error) {
      console.error("Error en addToCart:", error);
      socket.emit("error", "No se pudo agregar el producto: " + error.message);
    }
  });

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

const startServer = async () => {
  try {
    await connectDB();

    const productCount = await ProductsModel.countDocuments();
    console.log(`📦 Productos en la base de datos: ${productCount}`);
    if (productCount === 0) {
      console.log("⚠️  No hay productos en la base de datos.");
      console.log(
        "💡 Ejecuta 'npm run seed' o 'node src/seed.js' para crear productos de prueba."
      );
    } else {
      console.log(
        `✅ ${productCount} productos encontrados en la base de datos.`
      );
    }

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
