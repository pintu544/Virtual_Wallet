const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
    moneyRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoneyRequest',
      },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;