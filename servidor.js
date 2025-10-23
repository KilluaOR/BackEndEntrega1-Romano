//Me traigo la libreria express
import express from "express";
//Creo mi server
const servidor = express(); //Este es mi servidor

const PORT = 8080;

servidor.use(express.json());
//RUTA
//miServidor.METODO("RUTA",callback)
servidor.get("/api/productos", (req, res) => {
  console.log("Ruta 1");
  res.end("ruta de get");
});
servidor.post("/", (req, res) => {
  console.log("Ruta 2");
  res.end("ruta de post");
});

servidor.listen(PORT, () => {
  console.log(`server corriendo en el puerto ${PORT}`);
});
