const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
    // Get salt rounds from environment variable or default to 10
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continue to the save operation
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
