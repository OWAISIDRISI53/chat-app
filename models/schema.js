const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  user: String,
  message: String,
});

const chatModal = mongoose.model("Chat", chatSchema);

module.exports = chatModal;
