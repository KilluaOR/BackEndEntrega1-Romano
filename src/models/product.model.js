import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import validator from "validator";

const productCollection = "products";

//Schema
const productSchema = new mongoose.Schema(
  {
    //_id se crea automaticamente, no hace falta definirlo (ObjectID)
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    code: {
      type: String,
      required: [true, "El código es obligatorio"],
      unique: true,
      trim: true,
      validate: {
        validator: (valor) => {
          const esValido = validator.isAlphanumeric(valor, "es-ES"); //true o false
          console.log("esValido", esValido);
          return esValido;
        },
        message: "El código solo puede tener letras y números",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    thumbnails: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          //cada item debe tener una URL válida
          return arr.every((url) => validator.isURL(url));
        },
        message: "Cada imagen debe ser una URL válida",
      },
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//Plug in de paginación
productSchema.plugin(mongoosePaginate);

//Modelo
const ProductsModel = mongoose.model(productCollection, productSchema);

export default ProductsModel;
