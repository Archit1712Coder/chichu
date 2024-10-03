const xlsx = require("xlsx");
const FileData = require("../models/fileModel");

// Helper function to normalize column names
const normalizeColumnName = (col) =>
  col.trim().toLowerCase().replace(/\s+/g, "");

// Normalize and upload Excel data
const uploadFile = async (req, res, next) => {
  try {
    const filename = req.file.originalname.split(".")[0];
    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Expected column mappings
    const expectedColumns = {
      sno: "SNo",
      material: "Material",
      unit: "Unit",
      quantity: "Quantity",
      rate: "Rate",
      amount: "Amount",
    };

    // Normalize the data
    const normalizedData = rawData.map((row) => {
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeColumnName(key);
        if (expectedColumns[normalizedKey]) {
          normalizedRow[expectedColumns[normalizedKey]] = row[key];
        }
      });

      // Add default values for any missing columns
      return {
        SNo: normalizedRow.SNo || null,
        Material: normalizedRow.Material || null,
        Unit: normalizedRow.Unit || "N/A", // Default to "N/A" if Unit is missing
        Quantity: normalizedRow.Quantity || null,
        Rate: normalizedRow.Rate || null,
        Amount: normalizedRow.Amount || null,
      };
    });

    // Save or update the file data in MongoDB
    await FileData.findOneAndUpdate(
      { filename },
      { filename, data: normalizedData },
      { upsert: true, new: true },
    );

    res.status(200).json({ message: "File data saved successfully!" });
  } catch (err) {
    console.error("Error saving data:", err);
    next(err); // Pass error to global error handler
  }
};

// Retrieve data based on search
const getData = async (req, res, next) => {
  try {
    const { search = "" } = req.query;
    const query = search.trim()
      ? { filename: new RegExp(search.trim(), "i") }
      : {};

    const data = await FileData.find(query);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data:", err);
    next(err); // Pass error to global error handler
  }
};

module.exports = { uploadFile, getData };
