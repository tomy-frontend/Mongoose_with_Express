const mongoose = require("mongoose"); // mongooseの立ち上げ
const { Schema } = mongoose;

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

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
