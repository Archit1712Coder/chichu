const mongoose = require("mongoose");

// Schema for storing file data (grouped by filename)
const fileSchema = new mongoose.Schema({
  filename: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now },
  data: [
    {
      SNo: Number,
      Material: String,
      Unit: String,
      Quantity: Number,
      Rate: Number,
      Amount: Number,
      QuantityChange: String, // Stores percentage change or difference for quantity
      RateChange: String, // Stores percentage change or difference for rate
      AmountChange: String, // Stores percentage change or difference for amount
    },
  ],
});

const FileData = mongoose.model("FileData", fileSchema);

module.exports = FileData;
