const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.login = function (req, res) {
  return res.render("dashboard");
};

module.exports.register = function (req, res) {
  return res.render("dashboard");
};

module.exports.createRegister = async function (req, res) {
  console.log(req.body);
  try {
    const { email, password, userType } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      userType,
      walletBalance: userType === "premium" ? 2500 : 1000,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.createLogin = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const token = jwt.sign({ email: user.email, userId: user._id }, secretKey, {
      expiresIn: "15minutes",
    });
    res.status(200).json({
      token,
      userType: user.userType,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.userLogout = function (req, res) {
  res.redirect("/");
};
