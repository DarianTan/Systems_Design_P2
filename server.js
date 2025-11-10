// --- imports ---
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AnimeEntry = require("./models/AnimeEntry"); // ✅ import your schema

const app = express();
const PORT = process.env.PORT || 3000;

// --- middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- test route 1 ---
app.get("/", (req, res) => {
  res.send("Anime Watchlist API is running ✅");
});

// --- test route 2 ---
app.get("/test-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      ok: true,
      message: "DB connection works!",
      collections: collections.map(c => c.name),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- test route 3 (new) ---
app.get("/add-sample", async (req, res) => {
  try {
    const newAnime = new AnimeEntry({
      title: "Chainsaw Man",
      status: "watching",
      rating: 9,
      startedDate: new Date(),
      favoriteCharacter: "Denji",
      notes: "Love the chaotic energy.",
      tags: ["action", "dark comedy"],
    });

    await newAnime.save();
    res.json({ ok: true, message: "Sample anime added!", data: newAnime });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const animeRoutes = require("./routes/animeRoutes");
app.use("/api/entries", animeRoutes);

// --- connect and start server ---
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Using database:", mongoose.connection.db.databaseName);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
}

startServer();
