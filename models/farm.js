const mongoose = require("mongoose"); // mongooseの立ち上げ
const { Schema } = mongoose;
const Product = require("./product");

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "nameが必要です。"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "emailが必要です。"],
  },
  // productsへの参照
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

// farmが削除されるとその農場のproductsがあれば、すべて削除するミドルウェア
farmSchema.post("findOneAndDelete", async function (farm) {
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(res);
  }
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
