import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/*REGISTER A USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      ocupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      ocupation,
      ViewdProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) res.status(400).send("User does  not exist");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user) res.status(400).send("Invalid credintials");
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    delete user.password;
    res.status(200).send({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
