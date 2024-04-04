import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectroute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ error: "Error Occurs In Token" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res.status(400).json({ error: "Not Valid User" });
    }
    const user = await User.findById(decodeToken.usrId);
    req.user = user;
    next();
  } catch (error) {
    console.error("This Error From Protect Router", error.message);
    res.status(400).json({ error: "An Error Occurs In Auth" });
  }
};
export default protectroute;
