import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schema
const BiodataSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
});

const Biodata = mongoose.model("Biodata", BiodataSchema);

// API Endpoint to store biodata
app.post("/api/biodata", async (req, res) => {
  try {
    const newEntry = new Biodata(req.body);
    await newEntry.save();
    res.json({ message: "✅ Biodata submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to save data" });
  }
});

// API Endpoint to get all biodata
app.get("/api/biodata", async (req, res) => {
  try {
    const biodataList = await Biodata.find();
    res.json(biodataList);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch data" });
  }
});

// Serve the frontend for testing (optional)
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
