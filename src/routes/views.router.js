import { Router } from "express";
import {
  viewsHomeController,
  viewsPLController,
  viewsRTPController,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", viewsHomeController);

router.get("/realtimeproducts", viewsRTPController);

router.get("/productsList", viewsPLController);

export default router;
