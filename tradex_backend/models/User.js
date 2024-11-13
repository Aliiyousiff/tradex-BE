const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },   password: { type: String, required: true },
  wallet: { type: Number, default: 10000 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  favorites: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  // Check if the password is modified before applying hashing
  if (!this.isModified('password')) return next();
  try {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
