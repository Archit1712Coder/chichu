const xlsx = require("xlsx");
const FileData = require("../models/fileModel");

// Helper function to normalize column names
const normalizeColumnName = (col) =>
  col.trim().toLowerCase().replace(/\s+/g, "");

// Calculate percentage or number differences
const calculateDifference = (newValue, oldValue) => {
  const difference = newValue - oldValue;
  const percentageChange = ((newValue - oldValue) / oldValue) * 100;
  return {
    difference,
    percentageChange: isNaN(percentageChange) ? 0 : percentageChange.toFixed(2),
  };
};

// Upload and update existing file data
const uploadFile = async (req, res, next) => {
  try {
    const filename = req.file.originalname.split(".")[0];
    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const expectedColumns = {
      sno: "SNo",
      material: "Material",
      unit: "Unit",
      quantity: "Quantity",
      rate: "Rate",
      amount: "Amount",
    };

    const normalizedData = rawData.map((row) => {
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeColumnName(key);
        if (expectedColumns[normalizedKey]) {
          normalizedRow[expectedColumns[normalizedKey]] = row[key];
        }
      });

      return {
        SNo: normalizedRow.SNo || null,
        Material: normalizedRow.Material || null,
        Unit: normalizedRow.Unit || "N/A",
        Quantity: normalizedRow.Quantity || null,
        Rate: normalizedRow.Rate || null,
        Amount: normalizedRow.Amount || null,
      };
    });

    // Check if file already exists in the database
    const existingFile = await FileData.findOne({ filename });

    if (existingFile) {
      // Update existing file data with differences
      existingFile.data = existingFile.data.map((existingRow) => {
        const updatedRow = normalizedData.find(
          (newRow) =>
            newRow.Material === existingRow.Material &&
            newRow.Unit === existingRow.Unit,
        );

        if (updatedRow) {
          const { difference: quantityDiff, percentageChange: quantityChange } =
            calculateDifference(updatedRow.Quantity, existingRow.Quantity);
          const { difference: rateDiff, percentageChange: rateChange } =
            calculateDifference(updatedRow.Rate, existingRow.Rate);
          const { difference: amountDiff, percentageChange: amountChange } =
            calculateDifference(updatedRow.Amount, existingRow.Amount);

          // Log the differences
          console.log(
            `Updating ${existingRow.Material} - ${existingRow.Unit}:`,
          );
          console.log(
            `Quantity: ${existingRow.Quantity} -> ${updatedRow.Quantity} (Difference: ${quantityDiff}, Change: ${quantityChange}%)`,
          );
          console.log(
            `Rate: ${existingRow.Rate} -> ${updatedRow.Rate} (Difference: ${rateDiff}, Change: ${rateChange}%)`,
          );
          console.log(
            `Amount: ${existingRow.Amount} -> ${updatedRow.Amount} (Difference: ${amountDiff}, Change: ${amountChange}%)`,
          );

          // Update the existing row with new values and differences
          return {
            ...existingRow,
            Quantity: updatedRow.Quantity,
            Rate: updatedRow.Rate,
            Amount: updatedRow.Amount,
            QuantityChange: quantityChange,
            RateChange: rateChange,
            AmountChange: amountChange,
          };
        }

        return existingRow; // If no update for this material/unit, keep the existing row
      });

      await existingFile.save();
      return res
        .status(200)
        .json({ message: "File data updated with changes!" });
    } else {
      // If no existing file, create a new document
      const newFile = new FileData({
        filename,
        data: normalizedData,
        timestamp: Date.now(),
      });
      await newFile.save();
      return res.status(200).json({ message: "File uploaded successfully!" });
    }
  } catch (err) {
    console.error("Error saving or updating data:", err);
    next(err);
  }
};

// Define the getData function for fetching data from MongoDB
const getData = async (req, res, next) => {
  try {
    const { search = "" } = req.query; // Get search query parameter
    const query = search.trim()
      ? { filename: new RegExp(search.trim(), "i") } // Search by filename (case-insensitive)
      : {};

    const data = await FileData.find(query); // Fetch data from MongoDB

    res.json(data); // Return the data to the frontend
  } catch (err) {
    console.error("Error retrieving data:", err);
    next(err); // Pass the error to the error handler
  }
};

// Delete a file by filename
const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const result = await FileData.findOneAndDelete({ filename });

    if (!result) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    next(err);
  }
};

// Update a specific row within a file by filename and SNo
const updateFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const { SNo, updatedRow } = req.body;

    const file = await FileData.findOne({ filename });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const rowIndex = file.data.findIndex((row) => row.SNo === SNo);
    if (rowIndex === -1) {
      return res.status(404).json({ message: "Row not found" });
    }

    file.data[rowIndex] = { ...file.data[rowIndex], ...updatedRow };
    await file.save();

    res.status(200).json({ message: "File row updated successfully" });
  } catch (err) {
    console.error("Error updating file row:", err);
    next(err);
  }
};

module.exports = { uploadFile, getData, deleteFile, updateFile };
