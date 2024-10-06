const User = require ('../model/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "MyKey";

const signup = async(req, res, next) => {
  const {name, email, password} = req.body;
  let existingUser;
  try{
    existingUser = await User.findOne({email: email});
  }catch(err){
    console.log(err);
  }

  if(existingUser) {
    return res.status(400).json({message: "user already exists! Login instead"});
  }

  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name, // name: name
    email,
    password: hashedPassword,
  });

  try{
    await user.save();
  } catch(err) {
    console.log(err);
  }

  return res.status(201).json({message:user});
};

const login = async(req,res, next) => {
  const {email, password } = req.body;

  let exisitingUser;
  try{
    exisitingUser = await User.findOne({email: email});

  }catch(err) {
    return new Error(err);
  }
  if(!exisitingUser){
    return res.status(400).json({message:"User not found, signup Please"})
  }
  const isPasswordCorrect = bcrypt.compareSync(password, exisitingUser.password);
  if(!isPasswordCorrect){
    return res.status(400).json({message:'Invalid Email / Password'})
  }

  const token = jwt.sign({id: exisitingUser._id}, JWT_SECRET_KEY, {
    expiresIn: "1hr"
  });

  return res.status(200).json({message:'Successfully Logged In', user:exisitingUser,token});

}

exports.signup = signup;
exports.login = login;