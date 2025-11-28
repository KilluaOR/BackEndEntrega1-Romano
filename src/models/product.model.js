import mongoose from "mongoose";
import validator from "validator";

//Schema
const productSchema = new mongoose.Schema({
  //_id se crea automaticamente, no hace falta definirlo (ObjectID)

  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  stock: {
    type: Number,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  code: {
    type: String,
    // required: true,
    unique: true,
    validate: {
      validator: (valor) => {
        const esValido = validator.isAlphanumeric(valor); //true o false

        console.log("esValido", esValido);

        return esValido;
      },
      message: "",
    },
  },
});

//Modelo
const ProductsModel = mongoose.model("Product", productSchema);

export default ProductsModel;
