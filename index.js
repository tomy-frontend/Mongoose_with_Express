const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3003;

const Product = require("./models/product"); // 作成したモデルをrequiredする
const Farm = require("./models/farm"); // 作成したモデルをrequiredする

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

// farm関連
// farmの新規登録ページパスへのルーティング
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

// farmのform送信後のルーティング
app.post("/farms", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  res.redirect("/farms");
});

// farmsの個別ページを追加するルーティング
app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/show", { farm });
});

// 各farmに商品を追加するページパスのルーティング
app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, farm });
});

// farmに商品を追加するルーティング
app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params; // リクエストからparamsの中のidを取得
  const farm = await Farm.findById(id); // Farmデータベースの中からidで探してfarm変数に格納する
  const { name, price, category } = req.body; //リクエストボディからname,price,categoryを取得
  const product = new Product({ name, price, category }); //取得したname,price,categoryを使用して、Productインスタンスを作成
  farm.products.push(product); // 作成した新規Productをfarmのproductsの配列にpush()
  product.farm = farm; // productの方にも、farmプロパティの中にfarmを代入
  await farm.save();
  await product.save();
  res.redirect(`/farms/${farm.id}`);
});

// product関連
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
  const product = await Product.findById(id).populate("farm", "name"); // 手に入れたidをもとに、findByIdを使用してMongoDBからproductを取ってきている
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
app
  .listen(PORT, () => {
    console.log(`ポート${PORT}でリクエスト受付中...`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`ポート${PORT}は既に使用されています。`);
      process.exit(1);
    } else {
      console.error("サーバー起動エラー:", err);
    }
  });
