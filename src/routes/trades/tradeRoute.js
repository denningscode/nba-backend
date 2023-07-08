import express from "express";
import { createDemoTrade, getDemoTrades, getTrades } from "../../controllers/trades/tradeController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router()

router.post("/demo", createDemoTrade);
router.get("/demo/all", verifyToken, getDemoTrades);
router.get("/all", verifyToken, getTrades);

export default router;