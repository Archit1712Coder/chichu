const xlsx = require("xlsx");
const FileData = require("../models/fileModel");

// Helper function to normalize column names
const normalizeColumnName = (col) =>
  col.trim().toLowerCase().replace(/\s+/g, "");

// Upload and normalize Excel data
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

    await FileData.findOneAndUpdate(
      { filename },
      { filename, data: normalizedData, timestamp: Date.now() },
      { upsert: true, new: true },
    );

    res.status(200).json({ message: "File data saved successfully!" });
  } catch (err) {
    console.error("Error saving data:", err);
    next(err);
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
    next(err);
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
