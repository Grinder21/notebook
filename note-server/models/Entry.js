const mongoose = require("mongoose");

const entryShema = new mongoose.Schema({
  title: { type: String, index: true },
  content: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Entry = mongoose.model("Entry", entryShema);

module.exports = Entry;
