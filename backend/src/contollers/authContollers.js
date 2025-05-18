import { User } from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCokie.js";

export const signup = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    if (!email || !password || !username) {
      throw new Error("Please! fill all fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }
    const emailAlreadExists = await User.findOne({ email });
    if (emailAlreadExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Input must be at least 6 characters long.",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    //jasonwibtukin
    generateTokenAndSetCookie(res, user._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const samePassword = await bcryptjs.compare(password, user.password);
    if (!samePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    generateTokenAndSetCookie(res, user._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "logIn successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  //res.clearCookie("token");
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logout successfully!" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
