const mongoose = require("mongoose");
var AutoIncrement = require('mongoose-sequence')(mongoose);
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    product: { 
      type: ObjectId, 
      ref: "Product" 
    },
    name: String,
    price: Number,
    count: Number
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {

    id:Number,
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    name: String,
    phone: { type: Number },
    address: String,
    pin: { type: Number },
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" }
  },

  { timestamps: true }
);

autoIncrement.initialize(mongoose.connection);

OrderSchema.plugin(autoIncrement.plugin, {
  model: "Order", // collection or table name in which you want to apply auto increment
  field: "id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

// OrderSchema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'id'});
  const Order = mongoose.model('Order', OrderSchema);




module.exports = { Order, CartItem };
