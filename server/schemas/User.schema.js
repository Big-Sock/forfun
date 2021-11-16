const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
