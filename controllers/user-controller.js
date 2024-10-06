const User = require ('../model/User');
const bcrypt = require("bcryptjs");

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

exports.signup = signup;