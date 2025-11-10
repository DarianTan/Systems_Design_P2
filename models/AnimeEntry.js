// models/AnimeEntry.js
const mongoose = require("mongoose");

// Define what each anime entry will look like in the database
const AnimeEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // removes extra spaces
  },
  status: {
    type: String,
    enum: ["watching", "completed", "plan_to_watch"],
    required: true,
    default: "plan_to_watch",
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  startedDate: {
    type: Date,
    required: true,
  },
  finishedDate: {
    type: Date,
  },
  favoriteCharacter: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Export the model
module.exports = mongoose.model("AnimeEntry", AnimeEntrySchema);
