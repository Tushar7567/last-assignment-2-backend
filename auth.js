const router = require("express").Router();
const User = require("./model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

// upload image uing multer

// const imageUploadPath = 'https://drive.google.com/drive/folders/1-_eLQg39DtH4rSY1CZ2XwK6uL3WO76yK?usp=share_link';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({ storage: storage });

// router.post('/image-upload', imageUpload.single("my-image-file"), (req, res) => {
//   console.log('POST request received to /image-upload.');
//   console.log('Axios POST body: ', req.body);
//   res.send('POST request recieved on server to /image-upload.');
// })

//REGISTER
router.post("/register", imageUpload.single("file"), async (req, res) => {
  // let formData = req.body;
  // console.log(formData);

  console.log(req.file);
  console.log(req.body);

  const hashPass = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPass,
    phone: req.body.phone,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    image: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: req.file.mimetype,
    },
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/", async (req, res) => {
    console.log(req.body.username);
    const user = await User.findOne({ username: req.body.username });
    console.log(user.isAdmin);
    if (user.isAdmin) {
      if (!user) {
        res.status(401).json("Wrong credentials!");
        return;
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        res.status(401).json("Wrong credentials!");
        return;
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC
      );
      res.cookie("jwtoken", accessToken, {
        expires: new Date(Date.now() + 259200),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      const { password, ...others } = user._doc;

      // console.log(user._doc);
      res.status(200).json({ ...others, accessToken });
    }
    else{
    res.status(500).json('You are not authorized');
    }
});

module.exports = router;
