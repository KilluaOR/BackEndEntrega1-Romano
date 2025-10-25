import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

export default router;
