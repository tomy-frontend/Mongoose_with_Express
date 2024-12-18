const express = require("express");
const app = express();
const path = require("path");

const Product = require("./models/product"); // 作成したモデルをrequiredする

// 注意:MongoDBのコマンドが実行されている必要がある
const mongoose = require("mongoose"); // mongooseの立ち上げ
mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB接続完了！");
  })
  .catch((error) => {
    console.log("MongoDB接続エラー！", error);
  });

// ejsのセットアップ
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// REST fulなルーティング設定
// productsページのルーティング、非同期で取得して、得た結果をもとに処理をするとか、手に入れたものをレスポンスで返すなどの処理にする
app.get("/products", async (req, res) => {
  const products = await Product.find({}); // データを全て取得する
  console.log(products);
  res.send("商品一覧ページ");
});

// サーバー立ち上げ
app.listen(3000, () => {
  console.log("ポート3000でリクエスト受付中...");
});
