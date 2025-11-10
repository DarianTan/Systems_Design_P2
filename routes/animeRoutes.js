// routes/animeRoutes.js
const express = require("express");
const router = express.Router();
const AnimeEntry = require("../models/AnimeEntry");

// --- CREATE (POST) ---
router.post("/", async (req, res) => {
  try {
    const newAnime = new AnimeEntry(req.body);
    await newAnime.save();
    res.status(201).json({ ok: true, message: "Anime added!", data: newAnime });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// --- READ ALL (GET) ---
router.get("/", async (req, res) => {
  try {
    const allAnime = await AnimeEntry.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: allAnime });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- READ ONE (GET by ID) ---
router.get("/:id", async (req, res) => {
  try {
    const anime = await AnimeEntry.findById(req.params.id);
    if (!anime) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: anime });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- UPDATE (PUT) ---
router.put("/:id", async (req, res) => {
  try {
    const updated = await AnimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, message: "Anime updated!", data: updated });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// --- DELETE (DELETE) ---
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AnimeEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, message: "Anime deleted!", data: deleted });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
