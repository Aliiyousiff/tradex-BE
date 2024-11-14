const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 10000,
    min: 0, // Ensure wallet balance cannot be negative
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Favorite',
    },
  ], // Reference to 'Favorite' model
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'History',
    },
  ], // Reference to 'History' model
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to add a favorite stock
userSchema.methods.addFavorite = function (favoriteId) {
  if (!this.favorites.includes(favoriteId)) {
    this.favorites.push(favoriteId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a favorite stock
userSchema.methods.removeFavorite = function (favoriteId) {
  this.favorites = this.favorites.filter(
    (favId) => favId.toString() !== favoriteId.toString()
  );
  return this.save();
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
