import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["IN", "OUT", "ADJUSTMENT"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
