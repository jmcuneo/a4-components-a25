// models/Wrestler.js
import mongoose from "mongoose";

const wrestlerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  weight: String,
  class: String,
  wins: Number,
  losses: Number
});

// Virtual property for win-loss record
wrestlerSchema.virtual("record").get(function () {
  return `${this.wins || 0}-${this.losses || 0}`;
});

const Wrestler = mongoose.model("Wrestler", wrestlerSchema);

export default Wrestler;
