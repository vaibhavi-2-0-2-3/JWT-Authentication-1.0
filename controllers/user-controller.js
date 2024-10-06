const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "MyKey";

// Signup function
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "Error checking existing user" });
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists! Login instead" });
  }

  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    return res.status(500).json({ message: "Error saving user" });
  }

  return res.status(201).json({ message: user });
};

// Login function
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "Error finding user" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found, please signup" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid Email / Password' });
  }

  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
    expiresIn: "30s"
  });

  res.cookie(String(existingUser._id), token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.status(200).json({ message: 'Successfully Logged In', user: existingUser, token });
};

// Token verification middleware
const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(401).json({ message: "No token found" });
  }

  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(403).json({ message: "Token missing in the header" });
  }

  jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    req.id = user.id;
    next();
  });
};

// Get user details function
const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  
  try {
    user = await User.findById(userId, "-password");  // Corrected 'user.findById' to 'User.findById'
  } catch (err) {
    return res.status(500).json({ message: "Error finding user" });
  }

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  return res.status(200).json({ user });
};

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
