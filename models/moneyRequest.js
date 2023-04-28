const mongoose = require("mongoose");

const moneyRequestSchema = new mongoose.Schema({
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    charges: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      required: true,
      default: 'pending',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
});
  
const MoneyRequest = mongoose.model('MoneyRequest', moneyRequestSchema);
  
module.exports =  MoneyRequest ;