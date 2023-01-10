const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });


const verifyToken = (req, res, next) => {
  console.log("verifytoken");
  const authHeader = req.headers.cookie;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.replace("jwtoken=", "");
    console.log(token);
    const verifyToken = jwt.verify(token, process.env.JWT_SEC)
  
      if (!verifyToken) {
        res.status(403).json("Token is not valid!");
      }
      req.user_id = verifyToken._id;
      console.log('token verified');
      next();
    
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// const verifyTokenAndAuthorization = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not alowed to do that!");
//     }
//   });
// };

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log(req.data);
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  // verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
