const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("データベース接続に成功"))
  .catch((error) => console.log(error));

//ベースで使うAPIエンドポイント設定
app.use("/api/users/", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.listen(process.env.PORT || 3000, () =>
  console.log("サーバーが起動しました")
);
