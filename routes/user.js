const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

/* ユーザー関係 */
const router = require("express").Router();

//-----------------------------------------------
//まず初めにエンドポイント設定の確認をすること。
// router.get("/usertest", (req, res) => {
//   res.send("ユーザーテスト成功");
// });

// router.post("/userposts", (req, res) => {
//   const username = req.body.username;
//   res.send("あなたのユーザー名：" + username);
// });
//-----------------------------------------------

//情報更新
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    //パスワード更新？
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ユーザー削除
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("ユーザーが削除されました");
  } catch (err) {
    res.send(500).json(err);
  }
});

//ユーザー取得
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(201).json(others);
  } catch (err) {
    res.send(500).json(err);
  }
});

//全ユーザー取得
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.send(500).json(err);
  }
});

module.exports = router;
