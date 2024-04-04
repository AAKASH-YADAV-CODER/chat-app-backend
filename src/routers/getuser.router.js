import { Router } from "express";
import { getuser } from "../controllers/getUser.controller.js";
import protectroute from "../middleware.js/protectRoute.js";
const router = Router();
router.post("/", protectroute, getuser);
export default router;
