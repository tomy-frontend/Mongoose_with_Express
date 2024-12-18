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
  res.render("products/index", { products }); // products/index.ejsを表示
});

// 商品詳細ページのルーティング
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id); // 手に入れたidをもとに、findByIdを使用してMongoDBからproductを取ってきている
  res.render("products/show", { product });
});

// サーバー立ち上げ
app.listen(3000, () => {
  console.log("ポート3000でリクエスト受付中...");
});
