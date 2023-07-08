import express from "express";
import { approveFunding } from "../../controllers/admin/adminController.js";

const router = express.Router();

router.post("/approve/:id", approveFunding);


export default router;