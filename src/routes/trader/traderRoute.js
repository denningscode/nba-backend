import express from "express";
import { getTrader } from "../../controllers/trader/traderController.js";

const router = express.Router();

router.post("/", getTrader);


export default router