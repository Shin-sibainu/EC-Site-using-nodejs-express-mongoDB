const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//登録
router.post("/register", async (req, res) => {
  //Userモデルと接続
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    //暗号化して登録
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString(),
  });

  try {
    //Userモデルに新規追加
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  //UserモデルからUserを探す
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    !user && res.status(401).json("そのユーザーは存在しません。");

    //パスワード複合
    const encryptPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASS
    );

    //パスワード検証
    const originalPassword = encryptPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("パスワードが違います");

    //jwt(認証方式の１つ。ログインするときに使う。)
    //jwt.sign(payload, SECRET_KET, option) //アクセストークン作成
    //本人が許可出したことの証明書がアクセストークン。これがないと悪意のある人が簡単にデータ取得できちゃう。
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const { password, ...others } = user._doc;

    res.status(201).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
