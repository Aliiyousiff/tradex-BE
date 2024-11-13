const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true }, 
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  wallet:     { type: Number, default: 10000 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  favorites:  [{ type: String }],
  createdAt:  { type: Date, default: Date.now },
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);