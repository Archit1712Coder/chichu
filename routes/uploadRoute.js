const express = require("express");
const multer = require("multer");
const { uploadFile, getData } = require("../controllers/fileController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file route
router.post("/upload", upload.single("file"), uploadFile);

// Get data route
router.get("/data", getData);

module.exports = router;
