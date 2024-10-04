const mongoose = require("mongoose");

// Schema for storing file data (grouped by filename)
const fileSchema = new mongoose.Schema({
  filename: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now }, // Add timestamp field
  data: [
    {
      SNo: Number,
      Material: String,
      Unit: String,
      Quantity: Number,
      Rate: Number,
      Amount: Number,
    },
  ],
});

const FileData = mongoose.model("FileData", fileSchema);

module.exports = FileData;
