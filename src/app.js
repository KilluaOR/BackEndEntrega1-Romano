import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "path";

const app = express();
const PORT = 8080;

// Middleware para manejar JSON.
app.use(express.json()); //Interpreta datos enviados en fromato JSON.
app.use(express.urlencoded({ extended: true })); //Interperta datos enviados por formularios.

// Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("views engine", "handlebars");
app.use(express.static(__dirname + "/views"));

// app.get("/", (req, res) => {
//   let testUser = {
//     name: "Coder",
//     last_name: "House",
//   };
//   res.render("index", testUser);
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
