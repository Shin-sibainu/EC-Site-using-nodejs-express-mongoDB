const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("データベース接続に成功"))
  .catch((error) => console.log(error));

//ベースで使うAPIエンドポイント設定
app.use("/api/users/", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 3000, () =>
  console.log("サーバーが起動しました")
);

// const date = new Date();
// const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
// const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

// console.log(date);
// console.log(lastMonth);
// console.log(previousMonth);
