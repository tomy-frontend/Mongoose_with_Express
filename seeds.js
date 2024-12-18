// 初期に投入するデータをseedという

const mongoose = require("mongoose");
const Product = require("./models/product"); // 作成したモデルをrequiredする

// index.jsとは関係なく、別で実行する必要があるのであらためてmongooseを時効する必要がある。
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

// 初期データ
const seedProducts = [
  {
    name: "ナス",
    price: 98,
    category: "野菜",
  },
  {
    name: "トマト",
    price: 128,
    category: "野菜",
  },
  {
    name: "りんご",
    price: 198,
    category: "果物",
  },
  {
    name: "プレーンヨーグルト",
    price: 158,
    category: "乳製品",
  },
  {
    name: "にんじん",
    price: 88,
    category: "野菜",
  },
  {
    name: "バナナ",
    price: 158,
    category: "果物",
  },
  {
    name: "ブロッコリー",
    price: 248,
    category: "野菜",
  },
  {
    name: "モッツァレラチーズ",
    price: 398,
    category: "乳製品",
  },
  {
    name: "みかん",
    price: 198,
    category: "果物",
  },
  {
    name: "牛乳",
    price: 238,
    category: "乳製品",
  },
];

Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
