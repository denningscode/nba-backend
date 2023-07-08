import express from "express";
import { registerUser, loginUser, currentUser, getCopyStatus, getStatusBar } from "../../controllers/user/userController.js";
import verifyToken from "../../middlewares/verify/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, currentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/copy/status", verifyToken, getCopyStatus);
router.get("/copy/bar", verifyToken, getStatusBar);


export default router;