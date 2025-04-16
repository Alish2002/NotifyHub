const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Store securely (hashed)
  priority: { type: String, default: "low" } // Default priority
}); 

const User = mongoose.model('User', userSchema);

module.exports = User;
