const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Function to handle buying cryptocurrencies
exports.buyCrypto = async (req, res) => {
  const { userId, cryptoSymbol, amount, price } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assume price is provided or fetched from an API
    const totalCost = amount * price;
    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    user.balance -= totalCost;  // Deduct the total cost from user's balance
    const transaction = new Transaction({
      user: userId,
      type: 'buy',
      symbol: cryptoSymbol,
      amount,
      price
    });

    await transaction.save();
    await user.save();

    res.status(201).json({ message: 'Crypto bought successfully!', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to handle selling cryptocurrencies
exports.sellCrypto = async (req, res) => {
  const { userId, cryptoSymbol, amount, price } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Here you might want to check if the user owns enough crypto
    // This part is omitted for simplicity

    const totalGain = amount * price;
    user.balance += totalGain;  // Add the total gain to user's balance
    const transaction = new Transaction({
      user: userId,
      type: 'sell',
      symbol: cryptoSymbol,
      amount,
      price
    });

    await transaction.save();
    await user.save();

    res.status(201).json({ message: 'Crypto sold successfully!', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
