const User = require("./model/User");
// const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt")


const {
  verifyToken,
  // verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:username",  verifyToken, async (req, res) => {
  // if (req.body.password) {
  //   req.body.password = await bcrypt.hash(req.body.password, 10)
  // }

  try {
    const updatedUser = await User.updateOne(
      {username: req.body.username},
      {
        $set: {
          phone: req.body.phone,
          state: req.body.state,
          country: req.body.country,
          city: req.body.city,
          image: req.body.image,
        }
      },
    );
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
