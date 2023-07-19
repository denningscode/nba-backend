import express from "express";
import { getTrader, copyTrader, stopCopy } from "../../controllers/trader/traderController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.post("/", getTrader);

router.post("/copy", verifyToken, copyTrader);

router.get("/stop", verifyToken, stopCopy);


export default router