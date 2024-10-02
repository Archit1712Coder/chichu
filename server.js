// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas Connection
const mongoURI =
  "mongodb+srv://tester:8xvJccFpNT3FIpEt@cluster0.hgfbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Define a Schema and Model
const dataSchema = new mongoose.Schema({
  SNo: Number,
  Material: String,
  Unit: String,
  Quantity: Number,
  Rate: Number,
  Amount: Number,
  clientname: String, // Ensure this field is present
});

const Data = mongoose.model("Data", dataSchema);

// Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File uploaded:", req.file);

    const clientName = req.file.originalname.split(".")[0];
    console.log("Client Name:", clientName);

    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const dataWithClientName = data.map((item) => ({
      ...item,
      clientname: clientName,
    }));

    console.log("Data to be saved:", dataWithClientName); // Log the data to be saved

    await Data.insertMany(dataWithClientName);
    res.status(200).send("Data saved successfully!");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data: " + err.message);
  }
});

// Endpoint to get data
// Endpoint to get data
app.get("/data", async (req, res) => {
  try {
    const { search = "" } = req.query;
    const regex = new RegExp(search, "i");
    const data = await Data.find({ clientname: regex });

    console.log("Data retrieved from DB:", data); // Log the retrieved data

    res.json(data);
  } catch (err) {
    console.error("Error retrieving data:", err); // Log any errors
    res.status(500).send("Error retrieving data: " + err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
