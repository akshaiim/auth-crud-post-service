const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
    max: 30,
    min:3
  },image: {
    type: String,
    required: true,
  },title: {
    type: String,
    required: true,
    unique: true,
    max: 20,
    min:3
  },
  description: {
    type: String,
    required: true,
    max: 3000,
    min:10
  },
  tags: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
