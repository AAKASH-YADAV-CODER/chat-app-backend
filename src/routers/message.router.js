import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/sendMsg.controller.js";
import protectroute from "../middleware.js/protectRoute.js";
const router = Router();
router.post("/:id", protectroute, getMessage);
router.post("/send/:id", protectroute, sendMessage);
export default router;
