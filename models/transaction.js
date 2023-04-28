const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    sender: {
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
    type: {
      type: String,
      enum: ['sending', 'receiving'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
      default: 'pending',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;