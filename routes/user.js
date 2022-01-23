const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

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

module.exports = router;
