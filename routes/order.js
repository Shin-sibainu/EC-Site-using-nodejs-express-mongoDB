const router = require("express").Router();

const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//情報更新
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//商品削除
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("注文が削除されました");
  } catch (err) {
    res.send(500).json(err);
  }
});

//ユーザーカートの取得(ユーザーIDを入力する)
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Cart.find({ userId: req.params.userId });

    res.status(201).json(orders);
  } catch (err) {
    res.send(500).json(err);
  }
});

//全商品取得
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = new Cart.find();
    res.status(201).json(orders);
  } catch (err) {
    res.send(500).json(err);
  }
});

//月の収入を取得
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    //$match:フィルター。$project:集計結果の表示を指定。$group:表示結果のキー設定と集計方法の設定。
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
