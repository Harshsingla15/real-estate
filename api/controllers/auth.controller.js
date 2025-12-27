import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({
      success: false,
      message: "All fields are mandatory",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created Successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
