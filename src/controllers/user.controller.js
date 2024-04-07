import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateJWT from "../utilities/generateJWT.js";
//Register User
const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password, confirmPassword, gender } =
      req.body;
    if (
      [fullName, userName, email, password, gender].some(
        (field) => field.trim() === ""
      ) ||
      !email.includes("@")
    ) {
      return res.status(400).json({
        error: "Please enter all required Fields and Enter Valid Data",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const existedUser = await User.findOne({
      $or: [{ email }, { password }],
    });
    if (existedUser) {
      return res.status(400).json({ error: "Already Existed User❌" });
    }
    const rounds = await bcryptjs.genSalt(10);
    const encryptedPwd = await bcryptjs.hash(password, rounds);

    // https://avatar-placeholder.iran.liara.run/  so this url generating new pic every refresh

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    const newUser = await User.create({
      fullName,
      email,
      userName,
      password: encryptedPwd,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      const token = generateJWT(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        fullName: newUser.fullName,
        email: newUser.email,
        userName: newUser.userName,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
        message: "Successfully Signup✅",
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.error("The Error from signup", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//For login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      [email, password].some((field) => field.trim() === "") ||
      !email.includes("@")
    ) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }
    const existedData = await User.findOne({
      email,
    });
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existedData?.password || ""
    );
    if (!existedData || !isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }
    const token = generateJWT(existedData._id, res);
    res.status(200).json({
      _id: existedData._id,
      fullName: existedData.fullName,
      userName: existedData.userName,
      profilePic: existedData.profilePic,
      email: existedData.email,
      message: "Successfully Login✅",
      token,
    });
  } catch (error) {
    console.error("The Error is", error.message);
    res.json(400).json({ error: "SomeThing Went wrong" });
  }
};
//For Logout2
const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully✅" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { signup, login, logout };
