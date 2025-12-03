import { Router } from "express";
import {
  viewsCartDetailController,
  viewsHomeController,
  viewsPLController,
  viewsProductDetailController,
  viewsRTPController,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", viewsHomeController);

router.get("/realtimeproducts", viewsRTPController);

router.get("/productsList", viewsPLController);

router.get("/products/:pid", viewsProductDetailController);

router.get("/carts/:cid", viewsCartDetailController);

export default router;
