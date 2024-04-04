import { Router } from "express";
import { login, logout, signup } from "../controllers/user.controller.js";
import protectroute from "../middleware.js/protectRoute.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectroute, logout);
export default router;
