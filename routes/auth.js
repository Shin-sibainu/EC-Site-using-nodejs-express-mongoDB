const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//登録
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString(),
  });

  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    !user && res.status(401).json("そのユーザーは存在しません。");

    const encryptPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASS
    );

    const originalPassword = encryptPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("パスワードが違います");

    const { password, ...others } = user._doc;

    res.status(201).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
