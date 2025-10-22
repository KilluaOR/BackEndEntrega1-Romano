// import fs from "fs/promises";

// await fs.readFile("");
// fs.writwFile("mensajes.txt", "primer mensaje");
//Me traigo la libreria express
import express from "express";
//Creo mi server
const servidor = express(); //Este es mi servidor

const PORT = 8080;

//RUTA
//miServidor.METODO("RUTA",callback)
servidor.get("/", (req, res) => {
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
