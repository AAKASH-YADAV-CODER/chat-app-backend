import { User } from "../models/user.model.js";

const getuser = async (req, res) => {
  try {
    const loggedIn = req.user._id;
    const users = await User.find({ _id: { $ne: loggedIn } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("This Error From Getting User", error.message);
    res.status(400).json({ error: "Same From getting User" });
  }
};
export { getuser };
