const router = require("express").Router();

const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//情報更新
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//商品削除
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("商品が削除されました");
  } catch (err) {
    res.send(500).json(err);
  }
});

//ユーザーカートの取得(ユーザーIDを入力する)
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    res.status(201).json(cart);
  } catch (err) {
    res.send(500).json(err);
  }
});

//全商品取得
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = new Cart.find();
    res.status(201).json(carts);
  } catch (err) {
    res.send(500).json(err);
  }
});

module.exports = router;
