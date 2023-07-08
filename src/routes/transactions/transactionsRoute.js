import express from "express";
import { getTrancactions, getDemoTrancactions } from "../../controllers/transactions/transactionsController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getTrancactions);
router.get("/demo", verifyToken, getDemoTrancactions);

export default router;