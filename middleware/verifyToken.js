// const jwt = require("jsonwebtoken");
// const dotenv = require('dotenv')

// dotenv.config()
// MY_SECRET= process.env.JWT_SECRET 


// module.exports = function (req, res, next) {
//   const token = req.header("x-auth-token");
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, MY_SECRET);
//     console.log('decodedd',decoded)
//     //req.user = decoded.userid // from UserController token ganerator
//     req.user = {id:decoded.userid}
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

// authMiddleware.js

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const MY_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, MY_SECRET);
    req.user = { id: decoded.userid };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
