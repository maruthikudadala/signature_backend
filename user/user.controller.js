const User = require('./models/user.model')
const bcrypt = require('bcrypt')
//login reqiures jwt token,dotenv,mysecret
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
MY_SECRET= process.env.JWT_SECRET 

// const UserRegister = async(req,res)=>{
//     const {name,email,password} =req.body
//     //console.log("Incoming body is:", req.body);

//     try{
//         const user = await User.findOne({email})
//         if(user){
//             return res.status(404).json({message:"email already exist"})
//         }
//     res.status(200).json({messgae:"used added succesfully"})
//         const hashedPassword = await bcrypt.hash(password,10);

//         const newUser = new User({
//             name,
//             email,
//             password:hashedPassword
//         })
//         const UserSaving = await newUser.save()
//     }
//     catch(err){
//         console.error('user saving error is',err)
//         res.status(400).json({error:"user saving catch error"})
//     }
// }
const UserRegister = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const userSaving = await newUser.save();
      res.status(201).json({ message: "User added successfully" });
    } catch (err) {
      console.error("User saving error is", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
//user login
const userLogin = async(req,res)=>{
    const {email,password} =req.body
    console.log("Incoming body is:", req.body);
    try{
        const user = await User.findOne({email})
        if(!email || !await bcrypt.compare(password, user.password)){
        return res.status(404).json({message:"email or passwors or not correct"})
    }
    const token = jwt.sign({userid:user._id},MY_SECRET,{expiresIn:'1h'});
        const userid = user._id
    res.status(201).json({message:"login succesfully", token,userid})
    }
    catch(err){
        console.error('user saving error is',err)
        res.status(400).json({error:"user login saving catch error"})
    }
}
module.exports = {UserRegister,userLogin}