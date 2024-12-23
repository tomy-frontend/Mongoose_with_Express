const express = require("express");
const app = express();
const path = require("path");

const Product = require("./models/product"); // 作成したモデルをrequiredする

// 注意:MongoDBのコマンドが実行されている必要がある
const mongoose = require("mongoose"); // mongooseの立ち上げ
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB接続完了!");
  })
  .catch((error) => {
    console.log("MongoDB接続エラー!", error);
  });

// ejsのセットアップ
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// optionの中身
const categories = ["果物", "野菜", "乳製品"];

// REST fulなルーティング設定
// productsページのルーティング、非同期で取得して、得た結果をもとに処理をするとか、手に入れたものをレスポンスで返すなどの処理にする
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "全" });
  }
});

// 商品追加ページのルーティング
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

// 商品新規作成のルーティング
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct.id}`); // 詳細ページにリダイレクトする。postのレスポンスでフォームの再送信を防ぐため
});

// 商品詳細ページのルーティング
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id); // 手に入れたidをもとに、findByIdを使用してMongoDBからproductを取ってきている
  res.render("products/show", { product });
});

// 編集ページのルーティング
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

// 編集処理ルーティング
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true, // バリデーションチェック
    new: true, // 更新と同時に新しいデータを受け取りたい場合true!
  });
  res.redirect(`/products/${product.id}`); // 商品詳細ページにリダイレクト
});

// 削除処理ルーティング
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

// サーバー立ち上げ
app.listen(3002, () => {
  console.log("ポート3002でリクエスト受付中...");
});
