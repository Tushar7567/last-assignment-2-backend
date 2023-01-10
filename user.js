const User = require("./model/User");
// const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt")
// const multer = require("multer");
// const fs = require("fs");


const {
  verifyToken,
  // verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const imageUpload = multer({ storage: storage });



//UPDATE
router.put("/edit/:user",async (req, res) => {
  // if (req.body.password) {
  //   req.body.password = await bcrypt.hash(req.body.password, 10)
  // }
  console.log(req.params.user);
  const username = req.params.user.replace("::", "");
  console.log(username);

  try {
    const updatedUser = await User.updateOne(
      {username: username},
      {
        $set: {
          email: req.body.email,
          phone: req.body.phone,
          country: req.body.country,
          state: req.body.state,
          city: req.body.city
          // image: {
          //   data: fs.readFileSync("uploads/" + req.file.filename),
          //   contentType: req.file.mimetype,
          // },
        }
      },
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:username",  verifyToken, async (req, res) => {
  try {
    // console.log(req.body.username);
    console.log(req.params.username);
    const username = req.params.username.replace(":", "");
    console.log(username);

    await User.deleteOne({username: username});
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


// //GET USER
// router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, ...others } = user._doc;
//     res.status(200).json(others);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get a particular user for edit
router.get("/edit/:user",async (req, res) => {
  try {
    console.log(req.params.user);
    const username = req.params.user.replace("::", "");
    console.log(username);
    let users = await User.find({username: username});
    // console.log(users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/",  verifyToken,async (req, res) => {
  try {
    let users = await User.find();
    // console.log(users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
