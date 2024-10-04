const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getData,
  deleteFile,
  updateFile,
} = require("../controllers/fileController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file route
router.post("/upload", upload.single("file"), uploadFile);

// Get data route
router.get("/data", getData);

// Delete file route
router.delete("/delete/:filename", deleteFile);

// Update file route
router.put("/update/:filename", updateFile);

module.exports = router;
