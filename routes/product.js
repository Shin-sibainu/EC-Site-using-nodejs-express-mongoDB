const router = require("express").Router();

const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //情報更新
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   if (req.body.password) {
//     //パスワード更新？
//     req.body.password = CryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.SECRET_PASS
//     ).toString();
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //ユーザー削除
// router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json("ユーザーが削除されました");
//   } catch (err) {
//     res.send(500).json(err);
//   }
// });

// //ユーザー取得
// router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, ...others } = user._doc;

//     res.status(201).json(others);
//   } catch (err) {
//     res.send(500).json(err);
//   }
// });

// //全ユーザー取得
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().limit(2).sort({ _id: -1 })
//       : await User.find();
//     res.status(201).json(users);
//   } catch (err) {
//     res.send(500).json(err);
//   }
// });

// //ユーザーステータスデータの取得(いつ登録したのか。)
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

//   try {
//     //特定のデータ収集
//     const data = await User.aggregate([
//       {
//         $match: { createdAt: { $gte: lastYear } },
//       },
//       {
//         $project: {
//           month: {
//             $month: "$createdAt",
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (err) {
//     res.send(500).json(err);
//   }
// });

module.exports = router;
