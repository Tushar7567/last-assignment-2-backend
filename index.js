const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config('./.env');
const userRoute = require("./user");
const authRoute = require("./auth");
const cors = require("cors");
// const fileuploader = require("express-fileupload")


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors({ origin: true, credentials: true }));
// app.use(cors());
app.use(express.json());
// app.use("/", (req,res)=>{
//   res.send("Connnected")
// });
// app.use(fileuploader());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
