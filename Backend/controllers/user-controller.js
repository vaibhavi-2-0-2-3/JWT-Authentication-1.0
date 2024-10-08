const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    // Find user by email
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "Error finding user" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found, please signup" });
  }

  // Check if password matches
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid Email / Password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "35s" // Short expiration for testing
  });

  console.log("Generated Token\n", token);

  // Clear existing cookies if any (not necessary unless you are reusing session logic)
  res.clearCookie(`${existingUser._id}`);

  // Set new cookie with token
  res.cookie(String(existingUser._id), token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 30), // Cookie will expire in 30 seconds
    httpOnly: true, // Secure cookie, can't be accessed via JavaScript
    sameSite: 'lax', // CSRF protection
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

  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
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

//Refresh Token
const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  
  // Check if cookies exist and if the token is present
  if (!cookies) {
    return res.status(400).json({ message: "No token found" });
  }

  const prevToken = cookies.split("=")[1]; // Extract token from the cookie
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  // Verify the previous token
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    // Clear the previous token cookie
    res.clearCookie(`${user.id}`);
    
    // Generate a new token
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "35s",
    });

    console.log("Regenerated Token\n",newToken);

    // Set a new cookie with the token
    res.cookie(String(user.id), newToken, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: 'lax',
    });

    req.id = user.id; // Attach user ID to the request object
    next(); // Move to the next middleware or request handler
  });
};


exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;