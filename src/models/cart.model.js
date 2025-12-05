import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // Referencia al modelo Product (mongoose pluraliza automáticamente)
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "La cantidad debe ser al menos 1"],
      },
    },
  ],
}, {
  timestamps: true, // Agregar createdAt y updatedAt automáticamente
});

const CartModel = mongoose.model(cartCollection, cartSchema);

export default CartModel;
